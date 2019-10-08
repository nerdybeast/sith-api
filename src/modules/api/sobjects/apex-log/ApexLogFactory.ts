import { Injectable } from '@nestjs/common';
import { ConnectionFactory } from '../../../../components/connection/ConnectionFactory';
import { ConnectionDetails } from '../../../../models/ConnectionDetails';
import { Connection } from '../../../../models/Connection';
import { ApexLogPoller } from './ApexLogPoller';

@Injectable()
export class ApexLogFactory {

	private connectionFactory: ConnectionFactory;

	constructor(connectionFactory: ConnectionFactory) {
		this.connectionFactory = connectionFactory;
	}

	public createPoller(socketId: string, connectionDetails: ConnectionDetails) : ApexLogPoller {
		const connection = new Connection(connectionDetails);
		const apexLogService = this.connectionFactory.createApexLogService(connection);
		const poller = new ApexLogPoller(socketId, connectionDetails, apexLogService);
		return poller;
	}

}