import { Controller, Get } from '@nestjs/common';
import { UserInfo } from '../../../../decorators/UserInfoDecorator';
import jsonapi from 'jsonapi-serializer';
import { Connection } from '../../../../models/Connection';
import { ConnectionFactory } from '../../../../components/connection/ConnectionFactory';
import { IDebugLevelService } from '../../../../components/services/IDebugLevelService';

@Controller('api/sobjects')
export class DebugLevelController {

	private connectionFactory: ConnectionFactory;

	constructor(connectionFactory: ConnectionFactory) {
		this.connectionFactory = connectionFactory;
	}

	@Get('/debug-levels')
	async debugLevelsAsync(@UserInfo() connection: Connection) {

		const debugLevelService: IDebugLevelService = this.connectionFactory.createDebugLevelService(connection);
		const fieldNames = await debugLevelService.getSobjectFieldNames();
		const debugLevels = await debugLevelService.getDebugLevels([], fieldNames);

		const data = new jsonapi.Serializer('debug-level', {
			attributes: fieldNames,
			keyForAttribute: 'camelCase'
		}).serialize(debugLevels);

		return data;
	}

}