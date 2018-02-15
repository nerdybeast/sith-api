import { Controller, Body, Get, Post } from '@nestjs/common';
import { UserInfo } from '../../../../decorators/UserInfoDecorator';
import { ConnectionDetails } from '../../../../models/ConnectionDetails';
import { AbstractSobjectService } from '../../../../components/services/AbstractSobjectService';
import * as jsonapi from 'jsonapi-serializer';
import { ApexLogService } from '../../../../components/services/ApexLogService';

@Controller('api/sobjects')
export class ApexLogController {

	@Get('/apex-logs')
	async apexLogsAsync(@UserInfo() connectionDetails: ConnectionDetails) : Promise<any> {

		const apexLogService = new ApexLogService(connectionDetails);
		const fieldNames = await apexLogService.getSobjectFieldNames();
		const apexLogs = await apexLogService.getApexLogs(connectionDetails.userId, fieldNames);

		const data = new jsonapi.Serializer('apex-log', {
			attributes: ['body', ...fieldNames],
			keyForAttribute: 'camelCase'
		}).serialize(apexLogs);

		return data;
	}

	@Post('/apex-log-body')
	async debugLogAsync(@UserInfo() connectionDetails: ConnectionDetails, @Body() body) {

		const apexLogService = new ApexLogService(connectionDetails);

		const apexLogBody = await apexLogService.getDebugLog(body.apexLogId);
		return apexLogBody;
	}

}