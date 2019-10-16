import { Injectable } from '@nestjs/common';
import { ConnectionFactory } from '../../../../components/connection/ConnectionFactory';
import { ConnectionDetails } from '../../../../models/ConnectionDetails';
import { Connection } from '../../../../models/Connection';
import { ApexLogPoller } from './ApexLogPoller';
import { ConfigService } from '../../../../components/config/ConfigService';

@Injectable()
export class ApexLogFactory {

	private connectionFactory: ConnectionFactory;
	private configService: ConfigService;

	constructor(connectionFactory: ConnectionFactory, configService: ConfigService) {
		this.connectionFactory = connectionFactory;
		this.configService = configService;
	}

	public createPoller(socketId: string, connectionDetails: ConnectionDetails) : ApexLogPoller {
		const connection = new Connection(connectionDetails);
		const apexLogService = this.connectionFactory.createApexLogService(connection);
		const poller = new ApexLogPoller(socketId, connectionDetails, apexLogService, this.configService);
		return poller;
	}

}