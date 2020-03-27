import { Injectable } from '@nestjs/common';
import { ConnectionFactory } from '../../../../components/connection/ConnectionFactory';
import { Connection } from '../../../../models/Connection';
import { TraceFlagPoller } from './TraceFlagPoller';
import { ConnectionDetails } from '../../../../models/ConnectionDetails';
import { ConfigService } from '../../../../components/config/ConfigService';

@Injectable()
export class TraceFlagFactory {

	private connectionFactory: ConnectionFactory;
	private configService: ConfigService;

	constructor(connectionFactory: ConnectionFactory, configService: ConfigService) {
		this.connectionFactory = connectionFactory;
		this.configService = configService;
	}

	public createPoller(socketId: string, connectionDetails: ConnectionDetails) : TraceFlagPoller {
		
		const connection = new Connection(connectionDetails);

		const debugLevelService = this.connectionFactory.createDebugLevelService(connection);
		const traceFlagService = this.connectionFactory.createTraceFlagService(connection, debugLevelService);
		const poller = new TraceFlagPoller(socketId, connectionDetails, debugLevelService, traceFlagService, this.configService);
		return poller;
	}
}