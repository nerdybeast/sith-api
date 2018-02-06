import { fork, ChildProcess } from 'child_process';
import { join } from 'path';
import { WebSocketGateway, NestGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Debug } from '../../../../utilities/debug';
import { ConnectionDetails } from '../../../../models/ConnectionDetails';
import { TraceFlagService } from '../../../../components/services/TraceFlagService';
import { TraceFlag } from '../../../../models/sobjects/TraceFlag';
import * as isEqual from 'lodash.isequal';
import * as jsonapi from 'jsonapi-serializer';
import { error } from 'util';
import { IpcMessage } from '../../../../models/IpcMessage';
import { IpcMessageType } from '../../../../models/enums/ipc-message-type';
import { TraceFlagIPC } from '../../../../models/ipc/TraceFlagIPC';

class OrgPoller {
	fork: ChildProcess;
	connections: ConnectionDetails[];
}

@WebSocketGateway({ namespace: 'trace-flags' })
export class TraceFlagGateway implements NestGateway {

	@WebSocketServer() server;

	private debug = new Debug('TraceFlagGateway');
	private socketMap = new Map<string, ConnectionDetails>();
	private pollingMap = new Map<string, OrgPoller>();

	handleConnection(client) {
		this.debug.verbose(`trace-flags client connected`, client.id);
	}

	handleDisconnect(client) {
		
		this.debug.verbose(`trace-flags client disconnected`, client.id);

		const connectionDetails = this.socketMap.get(client.id);
		this.socketMap.delete(client.id);
		
		const lastSingleUserConnection = this._isLastSingleUserConnection(this.socketMap, connectionDetails.userId);

		if(lastSingleUserConnection) {

			const orgPoller = this.pollingMap.get(connectionDetails.organizationId);
			
			//Should never be true but just in case...
			if(!orgPoller) {
				this.debug.error(`Last connection for a user was disconnected but this user was not part of an org poller group and should have been >`);
				this.debug.error(`User's connection details`, connectionDetails);
				return;
			}

			const userIndex = orgPoller.connections.findIndex(x => x.userId === connectionDetails.userId);

			if(userIndex === -1) {
				this.debug.error(`User's org was in the org poller but the user was not >`);
				this.debug.error(`User's connection details`, connectionDetails);
				return;
			}

			orgPoller.connections.splice(userIndex, 1);

			if(orgPoller.connections.length === 0) {
				orgPoller.fork.kill();
				return;
			}

			//Make sure the forked process is still active before sending the connections update.
			if(!orgPoller.fork.connected) {
				orgPoller.fork.kill();
				return;
			}

			const ipc = new TraceFlagIPC();
			ipc.connections = orgPoller.connections;
			ipc.pollingRateInMilliseconds = Number(process.env.TRACE_FLAG_POLLING_RATE);

			orgPoller.fork.send(ipc);
		}
	}

	@SubscribeMessage('handshake')
	async handshake(socket, connectionDetails: ConnectionDetails) {

		//Have each socket for the same user join a "room" so that we can emit messages to this single user.
		//If the user has multiple browser tabs open for this app, that would be multiple sockets for the same user.
		socket.join(connectionDetails.userId);

		this.addConnection(socket.id, connectionDetails);
	}

	addConnection(socketId, connectionDetails: ConnectionDetails) {

		const { organizationId, userId } = connectionDetails;

		this.socketMap.set(socketId, connectionDetails);

		if(!this.pollingMap.get(organizationId)) {
			const orgPoller = new OrgPoller();
			orgPoller.connections = [];
			this.pollingMap.set(organizationId, orgPoller);
		}
		
		const orgPoller = this.pollingMap.get(organizationId);
		
		if(!orgPoller.connections.find(x => x.userId === userId)) {
			orgPoller.connections.push(connectionDetails);
		}

		if(orgPoller.fork && orgPoller.fork.connected) {
			const ipc = new TraceFlagIPC();
			ipc.connections = orgPoller.connections;
			ipc.pollingRateInMilliseconds = Number(process.env.TRACE_FLAG_POLLING_RATE);
			orgPoller.fork.send(ipc);
			return;
		}

		//DO NOT add the file extension to "trace-flag-fork" file reference, this allows it to be evaluated as TS during development and JS when running live, win!
		const childProcess = fork(join(__dirname, 'trace-flag-fork'), ['--inspect=5859']);

		this.debug.verbose(`child process id`, childProcess.pid);

		childProcess.on('close', (code: number, signal: string) => this.debug.warning(`child process ${childProcess.pid} closed with code "${code}" and signal "${signal}"`));
		childProcess.on('disconnect', (code: number, signal: string) => this.debug.warning(`child process ${childProcess.pid} disconnected, code: "${code}", signal: "${signal}"`));
		childProcess.on('error', (error: Error) => this.debug.warning(`child process ${childProcess.pid} threw an error`, error));
		childProcess.on('exit', (code: number, signal: string) => this.debug.info(`child process ${childProcess.pid} exit, code: "${code}", signal: "${signal}"`));
		childProcess.on('message', (message: any) => this.onChildProcessMessage(message));
		
		orgPoller.fork = childProcess;

		const ipc = new TraceFlagIPC();
		ipc.connections = orgPoller.connections;
		ipc.pollingRateInMilliseconds = Number(process.env.TRACE_FLAG_POLLING_RATE);

		orgPoller.fork.send(ipc);
	}

	async onChildProcessMessage(message: any) {
		const { traceFlags, traceFlagFieldNames, debugLevelFieldNames } = message;
		const data = TraceFlagService.serializeToJsonApi(traceFlags, traceFlagFieldNames, debugLevelFieldNames);
		this.server.emit('trace-flags-update', data);
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