import camelCaseKeys = require('camelcase-keys');
import camelCase = require('lodash.camelcase');

import { Sobject } from '../../models/sobjects/Sobject';
import { Connection } from '../../models/Connection';
import { NotFoundException } from '@nestjs/common';
import { SobjectDescribeBase } from '../../models/salesforce-metadata/SobjectDescribeBase';
import { SearchResultDto } from '../../models/dto/SearchResultDto';
import { escapeSpecialCharacters } from '../../utilities/sanitize';
import { IToolingService } from './IToolingService';
import { IGenericSobjectService } from './IGenericSobjectService';
import { ConnectionFactory } from '../connection/ConnectionFactory';

export class SearchService {

	private connection: Connection;
	private connectionFactory: ConnectionFactory;
	private toolingService: IToolingService;

	constructor(connection: Connection, connectionFactory: ConnectionFactory) {
		this.connection = connection;
		this.connectionFactory = connectionFactory;
		this.toolingService = connectionFactory.createToolingService(connection);
	}

	async searchByIdentifier(identifier: string) : Promise<SearchResultDto[]> {

		const describe = await this.toolingService.globalDescribe();

		//Will be an sobject description which can only be true if the user entered an id to search on.
		const sobjectDescribeBase: SobjectDescribeBase = describe.find(x => identifier.startsWith(x.keyPrefix));

		let results: Sobject[];

		//Will be true if the user entered an id into the search.
		if(sobjectDescribeBase && identifier.length >= 15) {

			const genericSobjectService: IGenericSobjectService = this.connectionFactory.createGenericSobjectService(sobjectDescribeBase.name, this.connection);

			const sobject = await genericSobjectService.retrieve(identifier);
			results = [sobject];

		} else {

			const genericSobjectService: IGenericSobjectService = this.connectionFactory.createGenericSobjectService('', this.connection);
			const escapedIdentifier = escapeSpecialCharacters(identifier);

			const soslResults: Sobject[] = await genericSobjectService.search(`FIND {*${escapedIdentifier}*} IN NAME FIELDS LIMIT 10`);

			if(soslResults.length === 0) {
				throw new NotFoundException(`No records were found for the identifier "${identifier}".`);
			}

			results = soslResults;
		}

		//Little hack to remove duplicates from an array
		let sobjectNames = results.map(x => x.attributes.type);
		sobjectNames = Array.from(new Set(sobjectNames));

		const sobjectDescriptionPromises = sobjectNames.map(sobjectName => this.toolingService.sobjectDescribe(sobjectName));
		const sobjectDescriptions = await Promise.all(sobjectDescriptionPromises);

		//TODO: use array reduce to make less calls to Salesforce, calling retrieve for every record is inefficient.
		const retrievePromises = results.map(sobject => {
			const genericSobjectService: IGenericSobjectService = this.connectionFactory.createGenericSobjectService(sobject.attributes.type, this.connection);
			return genericSobjectService.retrieve(sobject.id);
		});

		const records = await Promise.all(retrievePromises);

		const searchResults = records.map(record => {

			const sobjectDescription = sobjectDescriptions.find(x => x.name === record.attributes.type);
			
			const recordCopy = camelCaseKeys(record as any);
			const nameFieldPropertyName = camelCase(sobjectDescription.fields.find(x => x.nameField).name);

			const searchResult = new SearchResultDto();
			searchResult.shortId = record.id.substring(0, 15);
			searchResult.sobject = record;
			searchResult.name = recordCopy[nameFieldPropertyName];

			return searchResult;
		});

		return searchResults;
	}

}