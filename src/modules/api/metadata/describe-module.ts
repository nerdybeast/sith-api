import { Module, Controller, Get, Param, Query } from '@nestjs/common';
import { UserInfo } from '../../../decorators/UserInfoDecorator';
import { SobjectDescribe } from '../../../models/salesforce-metadata/SobjectDescribe';
import { Connection } from '../../../models/Connection';
import { JsonApiService } from '../../../components/services/JsonApiService';
import { JsonApiDocument } from '../../../models/JsonApiDocument';
import { ActionOverride } from '../../../models/salesforce-metadata/ActionOverride';
import { MetadataActionOverride } from '../../../models/salesforce-metadata/MetadataActionOverride';
import { ActionOverrideDto, SobjectDescribeDto, FieldDto, RecordTypeDto, DisplayTypeEnum } from '../../../models/dto/SobjectDescribeDto';
import { RecordTypeInfo } from '../../../models/salesforce-metadata/RecordTypeInfo';
import { RecordType } from '../../../models/salesforce-metadata/RecordType';
import { ConnectionModule } from '../../../components/connection/ConnectionModule';
import { IMetadataService } from '../../../components/services/IMetadataService';
import { ConnectionFactory } from '../../../components/connection/ConnectionFactory';
import { IToolingService } from '../../../components/services/IToolingService';

@Controller('api/metadata/describe')
export class DescribeController {

	private connectionFactory: ConnectionFactory;

	//REMINDER: Nest can only DI concrete types
	constructor(connectionFactory: ConnectionFactory) {
		this.connectionFactory = connectionFactory;
	}

	@Get('/global')
	async getGlobalDescribe(@UserInfo() connection: Connection, @Query('q') q: string = null, @Query('start') start: number = 0, @Query('count') count: number = 20) {

		const toolingService: IToolingService = this.connectionFactory.createToolingService(connection);
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
	async getSobjectDescribe(@UserInfo() connection: Connection, @Param('sobjectName') sobjectName: string) : Promise<JsonApiDocument<SobjectDescribe>> {

		const toolingService: IToolingService = this.connectionFactory.createToolingService(connection);
		const metadataService: IMetadataService = this.connectionFactory.createMetadataService(connection);

		const customTypes = await metadataService.listCustomObjectTypes();
		const fileProperties = customTypes.find(x => x.fullName === sobjectName);

		const hasChanged = await metadataService.sobjectHasChanged(sobjectName, fileProperties);

		const [ sobjectDescribe, readResult ] = await Promise.all([
			toolingService.sobjectDescribe(sobjectName, hasChanged),
			metadataService.readSobjectMetadata(sobjectName, hasChanged)
		]);

		const sobjectDescribeDto = new SobjectDescribeDto();
		sobjectDescribeDto.name = sobjectDescribe.name;
		sobjectDescribeDto.actionOverrides = combineActionOverrides(sobjectDescribe.actionOverrides, readResult.actionOverrides);
		sobjectDescribeDto.recordTypes = combineRecordTypes(sobjectDescribe.recordTypeInfos, readResult.recordTypes);

		sobjectDescribeDto.fields = sobjectDescribe.fields.map(sobjectField => {

			const metaField = readResult.fields.find(x => x.fullName === sobjectField.name);
			const fieldDto = new FieldDto(sobjectField, metaField);

			switch(fieldDto.type) {
				case DisplayTypeEnum.CURRENCY:
					fieldDto.apiDataType = 'decimal';
					break;
				case DisplayTypeEnum.PERCENT:
					fieldDto.apiDataType = DisplayTypeEnum.DOUBLE;
					break;
				case DisplayTypeEnum.TEXT_AREA:
				case DisplayTypeEnum.REFERENCE:
				case DisplayTypeEnum.PICKLIST:
				case DisplayTypeEnum.MULTI_PICKLIST:
				case DisplayTypeEnum.EMAIL:
				case DisplayTypeEnum.PHONE:
				case DisplayTypeEnum.ID:
				case DisplayTypeEnum.ENCRYPTED_STRING:
				case DisplayTypeEnum.URL:
					fieldDto.apiDataType = DisplayTypeEnum.STRING;
					break;
				case DisplayTypeEnum.INTEGER:
				case DisplayTypeEnum.INTEGER_ABBREVIATED:
					fieldDto.apiDataType = DisplayTypeEnum.INTEGER;
					break;
				default:
					fieldDto.apiDataType = fieldDto.type;
					break;
			}

			return fieldDto;
		});

		const data = JsonApiService.serialize<SobjectDescribeDto>('sobject-metadata', sobjectDescribeDto, 'name');

		const document =  new JsonApiDocument<SobjectDescribe>(data);

		return document;
	}

}

@Module({
	imports: [
		ConnectionModule
	],
	controllers: [
		DescribeController
	]
})
export class DescribeModule { }

function combineActionOverrides(sobjectActionOverrides: ActionOverride[], metadataActionOverrides: MetadataActionOverride[]) : ActionOverrideDto[] {

	const combinedOverrides: ActionOverrideDto[] = [];

	metadataActionOverrides.forEach(mao => {

		let sobjectAO = sobjectActionOverrides.find(sao => sao.name === mao.actionName);

		if(!sobjectAO) sobjectAO = new ActionOverride();

		const aoDto = new ActionOverrideDto();
		aoDto.metadataActionOverride = mao;
		aoDto.sobjectActionOverride = sobjectAO;

		combinedOverrides.push(aoDto);
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

function combineRecordTypes(recordTypeInfos: RecordTypeInfo[], recordTypes: RecordType[]) : RecordTypeDto[] {

	return recordTypeInfos.map(rtInfo => {

		const metadataRecordType = recordTypes.find(rt => rt.label === rtInfo.name);

		const rtDto = new RecordTypeDto();
		rtDto.isAvailable = rtInfo.available;
		rtDto.isDefault = rtInfo.defaultRecordTypeMapping;
		rtDto.isMaster = rtInfo.master;
		rtDto.name = rtInfo.name;
		rtDto.id = rtInfo.recordTypeId;

		if(metadataRecordType) {
			rtDto.isActive = metadataRecordType.active;
			rtDto.description = metadataRecordType.description;
			rtDto.developerName = metadataRecordType.fullName;
		}

		return rtDto;
	});

}
