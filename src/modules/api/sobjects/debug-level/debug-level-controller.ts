import { Controller, Get } from '@nestjs/common';
import { UserInfo } from '../../../../decorators/UserInfoDecorator';
import { AbstractSobjectService } from '../../../../components/services/AbstractSobjectService';
import * as jsonapi from 'jsonapi-serializer';
import { DebugLevelService } from '../../../../components/services/DebugLevelService';
import { Connection } from '../../../../models/Connection';

@Controller('api/sobjects')
export class DebugLevelController {

	@Get('/debug-levels')
	async debugLevelsAsync(@UserInfo() connection: Connection) {

		const debugLevelService = new DebugLevelService(connection);
		const fieldNames = await debugLevelService.getSobjectFieldNames();
		const debugLevels = await debugLevelService.getDebugLevels([], fieldNames);

		const data = new jsonapi.Serializer('debug-level', {
			attributes: fieldNames,
			keyForAttribute: 'camelCase'
		}).serialize(debugLevels);

		return data;
	}

}