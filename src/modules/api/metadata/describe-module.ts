import { Module, Controller, Get, Param } from '@nestjs/common';
import { UserInfo } from '../../../decorators/UserInfoDecorator';
import { ToolingService } from '../../../components/services/ToolingService';
import * as jsonapi from 'jsonapi-serializer';
import { fieldNames } from '../../../models/salesforce-metadata/SobjectDescribe';
import { Connection } from '../../../models/Connection';

@Controller('api/metadata/describe')
export class DescribeController {

	@Get('/global')
	async getGlobalDescribe(@UserInfo() connection: Connection) {
		
		const toolingService = new ToolingService(connection);
		const sobjectDescribeBase = await toolingService.globalDescribe();

		const data = new jsonapi.Serializer('sobject-metadata', {
			id: 'name',
			attributes: fieldNames,
			keyForAttribute: 'camelCase',
			typeForAttribute(attr) { return attr; }
		}).serialize(sobjectDescribeBase);

		return data;
	}

	@Get('/:sobjectName')
	async getSobjectDescribe(@Param() params, @UserInfo() connection: Connection) {
		
		const toolingService = new ToolingService(connection);
		const sobjectDescribeBase = await toolingService.sobjectDescribe(params.sobjectName);

		const data = new jsonapi.Serializer('sobject-metadata', {
			id: 'name',
			attributes: fieldNames,
			keyForAttribute: 'camelCase',
			typeForAttribute(attr) { return attr; }
		}).serialize(sobjectDescribeBase);

		return data;
	}

}

@Module({
	controllers: [DescribeController]
})
export class DescribeModule { }