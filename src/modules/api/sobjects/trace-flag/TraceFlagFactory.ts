import { Injectable } from '@nestjs/common';
import { ConnectionFactory } from '../../../../components/connection/ConnectionFactory';
import { Connection } from '../../../../models/Connection';
import { TraceFlagPoller } from './TraceFlagPoller';
import { ConnectionDetails } from '../../../../models/ConnectionDetails';

@Injectable()
export class TraceFlagFactory {

	private connectionFactory: ConnectionFactory;

	constructor(connectionFactory: ConnectionFactory) {
		this.connectionFactory = connectionFactory;
	}

	public createPoller(socketId: string, connectionDetails: ConnectionDetails) : TraceFlagPoller {
		
		const connection = new Connection(connectionDetails);

		const debugLevelService = this.connectionFactory.createDebugLevelService(connection);
		const traceFlagService = this.connectionFactory.createTraceFlagService(connection, debugLevelService);
		const poller = new TraceFlagPoller(socketId, connectionDetails, debugLevelService, traceFlagService);
		return poller;
	}
}