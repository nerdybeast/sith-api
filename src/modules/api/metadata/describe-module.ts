import { Module, Controller, Get, Param } from '@nestjs/common';
import { UserInfo } from '../../../decorators/UserInfoDecorator';
import { ConnectionDetails } from '../../../models/ConnectionDetails';
import { ToolingService } from '../../../components/services/ToolingService';
import * as jsonapi from 'jsonapi-serializer';
import { fieldNames } from '../../../models/salesforce-metadata/SobjectDescribe';

@Controller('api/metadata/describe')
export class DescribeController {

	@Get('/global')
	async getGlobalDescribe(@UserInfo() connectionDetails: ConnectionDetails) {
		
		const toolingService = new ToolingService(connectionDetails);
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
	async getSobjectDescribe(@Param() params, @UserInfo() connectionDetails: ConnectionDetails) {
		
		const toolingService = new ToolingService(connectionDetails);
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