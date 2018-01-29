import { Controller, Body, Get, Post } from '@nestjs/common';
import { UserInfo } from '../../../../decorators/UserInfoDecorator';
import { ConnectionDetails } from '../../../../models/ConnectionDetails';
import { StandardSobjectService } from '../../../../components/services/standard-sobject-service';
import * as jsonapi from 'jsonapi-serializer';

@Controller('api/sobjects')
export class ApexLogController {

	@Get('/apex-logs')
	async apexLogsAsync(@UserInfo() connectionDetails: ConnectionDetails) : Promise<any> {

		const standardSobjectService = new StandardSobjectService(connectionDetails);

		const fieldNames = await standardSobjectService.getSobjectFieldNames('ApexLog', connectionDetails.orgId);
		const apexLogs = await standardSobjectService.getApexLogs(connectionDetails.userId, fieldNames);

		const data = new jsonapi.Serializer('apex-log', {
			attributes: ['body', ...fieldNames],
			keyForAttribute: 'camelCase'
		}).serialize(apexLogs);

		return data;
	}

	@Post('/apex-log-body')
	async debugLogAsync(@UserInfo() connectionDetails: ConnectionDetails, @Body() body) {

		const standardSobjectService = new StandardSobjectService(connectionDetails);

		const apexLogBody = await standardSobjectService.getDebugLog(body.apexLogId, body.apiVersion);
		return apexLogBody;
	}

}