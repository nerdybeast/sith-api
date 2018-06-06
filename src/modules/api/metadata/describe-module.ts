import { Module, Controller, Get, Param } from '@nestjs/common';
import { UserInfo } from '../../../decorators/UserInfoDecorator';
import { ToolingService } from '../../../components/services/ToolingService';
import * as jsonapi from 'jsonapi-serializer';
import { fieldNames, SobjectDescribe } from '../../../models/salesforce-metadata/SobjectDescribe';
import { Connection } from '../../../models/Connection';
import { MetadataService } from '../../../components/services/MetadataService';
import { JsonApiService } from '../../../components/services/JsonApiService';
import { JsonApiDocument } from '../../../models/JsonApiDocument';
import { ActionOverride } from '../../../models/salesforce-metadata/ActionOverride';
import { MetadataActionOverride } from '../../../models/salesforce-metadata/MetadataActionOverride';
import { ActionOverrideDto, SobjectDescribeDto } from '../../../models/dto/SobjectDescribeDto';

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
	async getSobjectDescribe(@Param() params, @UserInfo() connection: Connection) : Promise<JsonApiDocument<SobjectDescribe>> {
		
		const toolingService = new ToolingService(connection);
		const metadataService = new MetadataService(connection);

		const [ sobjectDescribe, readResult ] = await Promise.all([
			toolingService.sobjectDescribe(params.sobjectName),
			metadataService.readSobjectMetadata(params.sobjectName)
		]);

		// readResult.fields.forEach(customField => {

		// 	const sobjectField = sobjectDescribe.fields.find(x => x.name === customField.fullname);
			
		// 	if(sobjectField) {
		// 		sobjectField.inlineHelpText = customField.inlineHelpText;
		// 	}
		// });

		const sobjectDescribeDto = new SobjectDescribeDto();
		sobjectDescribeDto.name = sobjectDescribe.name;
		sobjectDescribeDto.actionOverrides = combineActionOverrides(sobjectDescribe.actionOverrides, readResult.actionOverrides);

		const jsonApiService = new JsonApiService();
		const data = jsonApiService.serialize<SobjectDescribe>('sobject-metadata', sobjectDescribe, 'name');
		//const data = jsonApiService.serialize<SobjectDescribeDto>('sobject-metadata', sobjectDescribeDto, 'name');

		const document =  new JsonApiDocument<SobjectDescribe>(data);

		return document;
	}

}

@Module({
	controllers: [DescribeController]
})
export class DescribeModule { }

function combineActionOverrides(sobjectActionOverrides: ActionOverride[], metadataActionOverrides: MetadataActionOverride[]) : ActionOverrideDto[] {

	const combinedOverrides: ActionOverrideDto[] = [];

	// sobjectActionOverrides.forEach(sao => {

	// 	const metadataActionOverride = metadataActionOverrides.find(mao => mao.actionName === sao.name);

	// 	const aoDto = new ActionOverrideDto();
	// 	aoDto.sobjectActionOverride = sao;
	// 	aoDto.metadataActionOverride = metadataActionOverride;

	// 	combinedOverrides.push(aoDto);
	// });

	metadataActionOverrides.forEach(mao => {

		let sobjectAO = sobjectActionOverrides.find(sao => sao.name === mao.actionName);

		if(!sobjectAO) sobjectAO = new ActionOverride();

		const aoDto = new ActionOverrideDto();
		aoDto.metadataActionOverride = mao;
		aoDto.sobjectActionOverride = sobjectAO;

		combinedOverrides.push(aoDto);

		// if(!combinedOverrides.some(co => co.sobjectActionOverride.name === mao.actionName)) {
			
		// 	const aoDto = new ActionOverrideDto();
		// 	aoDto.metadataActionOverride = mao;

		// 	combinedOverrides.push(aoDto);
		// }

	});

	sobjectActionOverrides.forEach(sao => {

		if(!combinedOverrides.some(co => co.sobjectActionOverride.name === sao.name)) {

			const aoDto = new ActionOverrideDto();
			aoDto.sobjectActionOverride = sao;
			aoDto.metadataActionOverride = new MetadataActionOverride();

			combinedOverrides.push(aoDto);
		}

	});

	return combinedOverrides;
}