import { Module, Controller, Get, Param, Query } from '@nestjs/common';
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
import { ActionOverrideDto, SobjectDescribeDto, FieldDto } from '../../../models/dto/SobjectDescribeDto';

@Controller('api/metadata/describe')
export class DescribeController {

	@Get('/global')
	async getGlobalDescribe(@UserInfo() connection: Connection, @Query('q') q: string = null, @Query('start') start: number = 0, @Query('count') count: number = 20) {
		
		const toolingService = new ToolingService(connection);
		let sobjectDescribeBase = await toolingService.globalDescribe();

		q = (q || '').toLowerCase();

		if(q) {
			sobjectDescribeBase = sobjectDescribeBase.filter(sobject => {
				const name  = (sobject.name || '').toLowerCase();
				const label = (sobject.label || '').toLowerCase();
				return name.includes(q) || label.includes(q);
			});
		}

		const filteredDescribe = sobjectDescribeBase.slice(start, start + count);

		const resources = filteredDescribe.map(resource => JsonApiService.serialize<SobjectDescribe>('sobject-metadata', resource, 'name'));
		const document =  new JsonApiDocument<SobjectDescribe>(resources);

		return document;
	}

	@Get('/:sobjectName')
	async getSobjectDescribe(@UserInfo() connection: Connection, @Param('sobjectName') sobjectName) : Promise<JsonApiDocument<SobjectDescribe>> {
		
		const toolingService = new ToolingService(connection);
		const metadataService = new MetadataService(connection);

		const [ sobjectDescribe, readResult ] = await Promise.all([
			toolingService.sobjectDescribe(sobjectName),
			metadataService.readSobjectMetadata(sobjectName)
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

		sobjectDescribeDto.fields = sobjectDescribe.fields.map(sobjectField => {
			const metaField = readResult.fields.find(x => x.fullName === sobjectField.name);
			return new FieldDto(sobjectField, metaField);
		});

		//const data = JsonApiService.serialize<SobjectDescribe>('sobject-metadata', sobjectDescribe, 'name');
		const data = JsonApiService.serialize<SobjectDescribeDto>('sobject-metadata', sobjectDescribeDto, 'name');

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