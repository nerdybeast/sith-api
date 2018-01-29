import { Controller, Get } from '@nestjs/common';
import { UserInfo } from '../../../../decorators/UserInfoDecorator';
import { ConnectionDetails } from '../../../../models/ConnectionDetails';
import { StandardSobjectService } from '../../../../components/services/standard-sobject-service';
import * as jsonapi from 'jsonapi-serializer';

@Controller('api/sobjects')
export class DebugLevelController {

	@Get('/debug-levels')
	async debugLevelsAsync(@UserInfo() connectionDetails: ConnectionDetails) {
		
		const standardSobjectService = new StandardSobjectService(connectionDetails);
		const fieldNames = await standardSobjectService.getSobjectFieldNames('DebugLevel', connectionDetails.orgId);
		const debugLevels = await standardSobjectService.getDebugLevels([], fieldNames);

		const data = new jsonapi.Serializer('debug-level', {
			attributes: fieldNames,
			keyForAttribute: 'camelCase'
		}).serialize(debugLevels);

		return data;
	}

}