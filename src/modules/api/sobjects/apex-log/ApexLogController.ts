import { Controller, Body, Get, Post } from '@nestjs/common';
import { UserInfo } from '../../../../decorators/UserInfoDecorator';
import jsonapi from 'jsonapi-serializer';
import { Connection } from '../../../../models/Connection';
import { ConnectionFactory } from '../../../../components/connection/ConnectionFactory';
import { IApexLogService } from '../../../../components/services/IApexLogService';

@Controller('api/sobjects')
export class ApexLogController {

	private connectionFactory: ConnectionFactory;

	constructor(connectionFactory: ConnectionFactory) {
		this.connectionFactory = connectionFactory;
	}

	@Get('/apex-logs')
	async apexLogsAsync(@UserInfo() connection: Connection) : Promise<any> {

		const apexLogService: IApexLogService = this.connectionFactory.createApexLogService(connection);
		const fieldNames = await apexLogService.getSobjectFieldNames();
		const apexLogs = await apexLogService.getApexLogs(connection.details.userId, fieldNames);

		const data = new jsonapi.Serializer('apex-log', {
			attributes: ['body', ...fieldNames],
			keyForAttribute: 'camelCase'
		}).serialize(apexLogs);

		return data;
	}

	@Post('/apex-log-body')
	async debugLogAsync(@UserInfo() connection: Connection, @Body() body) {

		const apexLogService: IApexLogService = this.connectionFactory.createApexLogService(connection);

		const apexLogBody = await apexLogService.getDebugLog(body.apexLogId);
		return apexLogBody;
	}

}