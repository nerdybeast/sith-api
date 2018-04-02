import { fork } from 'child_process';
import { join } from 'path';
import { WebSocketGateway, NestGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Debug } from '../../../../utilities/debug';
import { ConnectionDetails } from '../../../../models/ConnectionDetails';
import { UserPoller } from '../../../../models/ipc/UserPoller';
import { TraceFlagIPC } from '../../../../models/ipc/TraceFlagIPC';
import * as jsonapi from 'jsonapi-serializer';
import { ApexLogsUpdateIPC } from '../../../../models/ipc/ApexLogsUpdateIPC';

@WebSocketGateway({ namespace: 'APEX_LOGS' })
export class ApexLogGateway implements NestGateway {

	@WebSocketServer() server;

	private debug = new Debug('ApexLogGateway');
	
	/**
	 * Map key is the user id.
	 */
	private socketMap = new Map<string, ConnectionDetails>();
	
	/**
	 * Map key is the user id.
	 */
	private pollingMap = new Map<string, UserPoller>();

	handleConnection(client) {
		this.debug.verbose(`apex-logs client connected`, client.id);
	}

	handleDisconnect(client) {

		const connectionDetails = this.socketMap.get(client.id);
		this.socketMap.delete(client.id);

		const isLastSingleUserConnection = this._isLastSingleUserConnection(this.socketMap, connectionDetails.userId);

		if(!isLastSingleUserConnection) return;

		this.pollingMap.get(connectionDetails.userId).fork.kill();
	}

	@SubscribeMessage('start')
	async start(socket, connectionDetails: ConnectionDetails) {

		//Have each socket for the same user join a "room" so that we can emit messages to this single user.
		//If the user has multiple browser tabs open for this app, that would be multiple sockets for the same user.
		//NOTE: Sockets automatically leave rooms when they disconnect.
		socket.join(connectionDetails.userId);

		this.socketMap.set(socket.id, connectionDetails);

		if(!this.pollingMap.get(connectionDetails.userId)) {
			const newUserPoller = new UserPoller();
			newUserPoller.connection = connectionDetails;
			this.pollingMap.set(connectionDetails.userId, newUserPoller);
		}

		const userPoller = this.pollingMap.get(connectionDetails.userId);

		if(userPoller.fork && userPoller.fork.connected) return;

		const childProcess = fork(join(__dirname, 'apex-log-fork'), ['--inspect=5860']);
		
		this.debug.verbose(`child process id`, childProcess.pid);

		childProcess.on('close', (code: number, signal: string) => this.debug.warning(`child process ${childProcess.pid} closed with code "${code}" and signal "${signal}"`));
		childProcess.on('disconnect', (code: number, signal: string) => this.debug.warning(`child process ${childProcess.pid} disconnected, code: "${code}", signal: "${signal}"`));
		childProcess.on('error', (error: Error) => this.debug.warning(`child process ${childProcess.pid} threw an error`, error));
		childProcess.on('exit', (code: number, signal: string) => this.debug.info(`child process ${childProcess.pid} exit, code: "${code}", signal: "${signal}"`));
		childProcess.on('message', (message: ApexLogsUpdateIPC) => this.onChildProcessMessage(message));

		userPoller.fork = childProcess;

		const ipc = new TraceFlagIPC();
		ipc.connections = [userPoller.connection];
		ipc.pollingRateInMilliseconds = Number(process.env.TRACE_FLAG_POLLING_RATE);

		userPoller.fork.send(ipc);
	}

	onChildProcessMessage(ipc: ApexLogsUpdateIPC) {

		const data = new jsonapi.Serializer('apex-log', {
			attributes: [...ipc.fieldNames, 'body'],
			keyForAttribute: 'camelCase',
			typeForAttribute(attr) {
				//Prevents this serializer from converting "apex-log" to its plural form "apex-logs"
				return attr;
			}
		}).serialize(ipc.apexLogs);

		this.server.to(ipc.userId).emit('apex-logs-update', data);
	}

	private _isLastSingleUserConnection(connectionsMap: Map<string, ConnectionDetails>, userId: string) : boolean {

		let lastSingleUserConnection = true;

		for(const mappedDetails of this.socketMap.values()) {
			if(mappedDetails.userId === userId) {
				lastSingleUserConnection = false;
				break;
			}
		}

		return lastSingleUserConnection;
	}
}