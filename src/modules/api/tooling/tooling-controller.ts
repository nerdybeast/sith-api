import { Controller, Post, Body } from '@nestjs/common';
import { UserInfo } from '../../../decorators/UserInfoDecorator';
import { AnonymousApexDto } from '../../../models/dto/AnonymousApexDto';
import { ToolingService } from '../../../components/services/ToolingService';
import { ApexLogService } from '../../../components/services/ApexLogService';
import * as jsonapi from 'jsonapi-serializer';
import { AnonymousApexResult } from '../../../models/salesforce-metadata/AnonymousApexResult';
import { Connection } from '../../../models/Connection';

@Controller('api/tooling')
export class ToolingController {

	@Post('/executeAnonymousApex')
	async traceFlagsAsync(@UserInfo() connection: Connection, @Body() body: AnonymousApexDto) {

		const toolingService = new ToolingService(connection);
		const apexLogService = new ApexLogService(connection);

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