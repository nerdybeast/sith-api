import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Debug } from '../../../../utilities/debug';
import { ConnectionDetails } from '../../../../models/ConnectionDetails';
import { TraceFlagService } from '../../../../components/services/TraceFlagService';
import { TraceFlagsUpdateIPC } from '../../../../models/ipc/TraceFlagsUpdateIPC';
import { Client as SocketIoClient, Server as SocketIoServer } from 'socket.io';
import { TraceFlagPoller } from './TraceFlagPoller';
import { TraceFlagFactory } from './TraceFlagFactory';

@WebSocketGateway({ namespace: 'TRACE_FLAGS' })
export class TraceFlagGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	private traceFlagFactory: TraceFlagFactory;

	constructor(traceFlagFactory: TraceFlagFactory) {
		this.traceFlagFactory = traceFlagFactory;
	}

	@WebSocketServer() server: SocketIoServer;

	private debug = new Debug('TraceFlagGateway');

	//Key is the socket id
	private socketMap = new Map<string, ConnectionDetails>();

	//Key is the user's id
	private pollingMap = new Map<string, TraceFlagPoller>();

	afterInit() : void {
		this.debug.info(`trace-flags gateway initialized`);
	}

	handleConnection(client: SocketIoClient) : void {
		this.debug.info(`trace-flags client connected`, client.id);
	}

	handleDisconnect(client: SocketIoClient) : void {
		
		this.debug.info(`trace-flags client disconnected`, client.id);

		const connectionDetails: ConnectionDetails = this.socketMap.get(client.id);
		const traceFlagPoller: TraceFlagPoller = this.pollingMap.get(connectionDetails.userId);

		if(traceFlagPoller.removeSocketId(client.id)) {
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

	addConnection(socketId: string, connectionDetails: ConnectionDetails) {

		this.socketMap.set(socketId, connectionDetails);

		if(!this.pollingMap.has(connectionDetails.userId)) {
			const traceFlagPoller = this.traceFlagFactory.createPoller(socketId, connectionDetails);
			traceFlagPoller.poll();
			traceFlagPoller.on('traceFlagsUpdate', (ipc: TraceFlagsUpdateIPC) => this.onTraceFlagUpdateIPC(ipc));
			this.pollingMap.set(connectionDetails.userId, traceFlagPoller);
			return;
		}

		this.pollingMap.get(connectionDetails.userId).addSocketId(socketId);
	}

	async onTraceFlagUpdateIPC(ipc: TraceFlagsUpdateIPC) {

		ipc.traceFlagsByUser.forEach(user => {
			const data = TraceFlagService.serializeToJsonApi(user.traceFlags, ipc.traceFlagFieldNames, ipc.debugLevelFieldNames);
			this.server.to(user.userId).emit('trace-flags-update', data);
		});
	}
}
