import { Client as SocketIoClient, Server as SocketIoServer } from 'socket.io';
import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Debug } from '../../../../utilities/debug';
import { ConnectionDetails } from '../../../../models/ConnectionDetails';
import jsonapi from 'jsonapi-serializer';
import { ApexLogsUpdateIPC } from '../../../../models/ipc/ApexLogsUpdateIPC';
import { ApexLogFactory } from './ApexLogFactory';
import { ApexLogPoller } from './ApexLogPoller';

@WebSocketGateway({ namespace: 'APEX_LOGS' })
export class ApexLogGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server: SocketIoServer;

	private apexLogFactory: ApexLogFactory;

	constructor(apexLogFactory: ApexLogFactory) {
		this.apexLogFactory = apexLogFactory;
	}

	private debug = new Debug('ApexLogGateway');
	
	/**
	 * Map key is the socket id.
	 */
	private socketMap = new Map<string, ConnectionDetails>();
	
	/**
	 * Map key is the user id.
	 */
	private pollingMap = new Map<string, ApexLogPoller>();

	afterInit() {
		this.debug.info(`apex-logs gateway initialized`);
	}

	handleConnection(client: SocketIoClient) {
		this.debug.info(`apex-logs client connected`, client.id);
	}

	handleDisconnect(client: SocketIoClient) {

		this.debug.info(`apex-logs client disconnected`, client.id);

		const connectionDetails = this.socketMap.get(client.id);
		const apexLogPoller = this.pollingMap.get(connectionDetails.userId);
		apexLogPoller.removeSocketId(client.id);

		if(!apexLogPoller.HasClients) {
			this.pollingMap.delete(connectionDetails.userId);
		}

		this.socketMap.delete(client.id);
	}

	@SubscribeMessage('start')
	async start(socket: any, connectionDetails: ConnectionDetails) {

		//Have each socket for the same user join a "room" so that we can emit messages to this single user.
		//If the user has multiple browser tabs open for this app, that would be multiple sockets for the same user.
		//NOTE: Sockets automatically leave rooms when they disconnect.
		socket.join(connectionDetails.userId);

		this.addConnection(socket.id, connectionDetails);
	}

	private addConnection(socketId: string, connectionDetails: ConnectionDetails) : void {

		this.socketMap.set(socketId, connectionDetails);

		if(!this.pollingMap.has(connectionDetails.userId)) {
			const apexLogPoller = this.apexLogFactory.createPoller(socketId, connectionDetails);
			apexLogPoller.poll();
			apexLogPoller.on('apexLogsUpdate', (ipc: ApexLogsUpdateIPC) => this.onApexLogsUpdateIPC(ipc));
			this.pollingMap.set(connectionDetails.userId, apexLogPoller);
			return;
		}

		this.pollingMap.get(connectionDetails.userId).addSocketId(socketId);

		return;
	}

	private onApexLogsUpdateIPC(ipc: ApexLogsUpdateIPC) : void {

		const data = new jsonapi.Serializer('apex-log', {
			attributes: [...ipc.fieldNames, 'body'],
			keyForAttribute: 'camelCase',
			typeForAttribute(attr: string) {
				//Prevents this serializer from converting "apex-log" to its plural form "apex-logs"
				return attr;
			}
		}).serialize(ipc.apexLogs);

		this.server.to(ipc.userId).emit('apex-logs-update', data);

		return;
	}
}