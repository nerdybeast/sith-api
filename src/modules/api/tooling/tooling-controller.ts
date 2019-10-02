import { Controller, Post, Body } from '@nestjs/common';
import { UserInfo } from '../../../decorators/UserInfoDecorator';
import { AnonymousApexDto } from '../../../models/dto/AnonymousApexDto';
import jsonapi from 'jsonapi-serializer';
import { AnonymousApexResult } from '../../../models/salesforce-metadata/AnonymousApexResult';
import { Connection } from '../../../models/Connection';
import { ConnectionFactory } from '../../../components/connection/ConnectionFactory';
import { IToolingService } from '../../../components/services/IToolingService';
import { IApexLogService } from '../../../components/services/IApexLogService';

@Controller('api/tooling')
export class ToolingController {

	private connectionFactory: ConnectionFactory;

	constructor(connectionFactory: ConnectionFactory) {
		this.connectionFactory = connectionFactory;
	}

	@Post('/executeAnonymousApex')
	async traceFlagsAsync(@UserInfo() connection: Connection, @Body() body: AnonymousApexDto) {

		const toolingService: IToolingService = this.connectionFactory.createToolingService(connection);
		const apexLogService: IApexLogService = this.connectionFactory.createApexLogService(connection);

		const [anonymousApexResult, apexLogFieldNames] = await Promise.all([
			toolingService.executeAnonymousApex(body.apex),
			apexLogService.getSobjectFieldNames()
		]);

		const apexLogs = await apexLogService.getApexLogs(connection.details.userId, apexLogFieldNames, 1);
		const apexLog = apexLogs[0];

		anonymousApexResult.id = apexLog.id;
		anonymousApexResult.apexLog = apexLog;

		const data = new jsonapi.Serializer('anonymous-apex', {
			attributes: AnonymousApexResult.fieldNames,
			keyForAttribute: 'camelCase',
			typeForAttribute(attr) {
				switch(attr) {
					case 'apexLog': return 'apex-log';
					default: return attr;
				}
			},
			apexLog: {
				ref: 'id',
				attributes: [...apexLogFieldNames, 'body']
			}
		}).serialize(anonymousApexResult);

		return data;
	}

}