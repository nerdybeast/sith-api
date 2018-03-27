import { Controller, Body, Get, Post } from '@nestjs/common';
import { UserInfo } from '../../../../decorators/UserInfoDecorator';
import { AbstractSobjectService } from '../../../../components/services/AbstractSobjectService';
import * as jsonapi from 'jsonapi-serializer';
import { ApexLogService } from '../../../../components/services/ApexLogService';
import { Connection } from '../../../../models/Connection';

@Controller('api/sobjects')
export class ApexLogController {

	@Get('/apex-logs')
	async apexLogsAsync(@UserInfo() connection: Connection) : Promise<any> {

		const apexLogService = new ApexLogService(connection);
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

		const apexLogService = new ApexLogService(connection);

		const apexLogBody = await apexLogService.getDebugLog(body.apexLogId);
		return apexLogBody;
	}

}