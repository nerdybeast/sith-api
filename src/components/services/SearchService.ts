import camelCaseKeys = require('camelcase-keys');
import camelCase = require('lodash.camelcase');

import { Sobject } from '../../models/sobjects/Sobject';
import { Connection } from '../../models/Connection';
import { ToolingService } from './ToolingService';
import { GenericSobjectService } from './GenericSobjectService';
import { NotFoundException } from '@nestjs/common';
import { SobjectDescribeBase } from '../../models/salesforce-metadata/SobjectDescribeBase';
import { SearchResultDto } from '../../models/dto/SearchResultDto';
import { escapeSpecialCharacters } from '../../utilities/sanitize';

export class SearchService {

	constructor(private connection: Connection) { }

	async searchByIdentifier(identifier: string) : Promise<SearchResultDto[]> {

		const toolingService = new ToolingService(this.connection);
		const describe = await toolingService.globalDescribe();

		//Will be an sobject description which can only be true if the user entered an id to search on.
		const sobjectDescribeBase: SobjectDescribeBase = describe.find(x => identifier.startsWith(x.keyPrefix));

		let results: Sobject[];

		//Will be true if the user entered an id into the search.
		if(sobjectDescribeBase && identifier.length >= 15) {

			const service = new GenericSobjectService(sobjectDescribeBase.name, this.connection);
			const sobject = await service.retrieve<Sobject>(identifier);
			results = [sobject];

		} else {

			const temp = new GenericSobjectService('', this.connection);
			const escapedIdentifier = escapeSpecialCharacters(identifier);

			const soslResults: Sobject[] = await temp.search(`FIND {*${escapedIdentifier}*} IN NAME FIELDS LIMIT 10`);

			if(soslResults.length === 0) {
				throw new NotFoundException(`No records were found for the identifier "${identifier}".`);
			}

			results = soslResults;
		}

		let sobjectNames = results.map(x => x.attributes.type);
		sobjectNames = Array.from(new Set(sobjectNames));

		const sobjectDescriptionPromises = sobjectNames.map(sobjectName => toolingService.sobjectDescribe(sobjectName));
		const sobjectDescriptions = await Promise.all(sobjectDescriptionPromises);

		//TODO: use array reduce to make less calls to Salesforce, calling retrieve for every record is inefficient.
		const retrievePromises = results.map(sobject => {
			return new GenericSobjectService(sobject.attributes.type, this.connection).retrieve<Sobject>(sobject.id);
		});

		const records = await Promise.all(retrievePromises);

		const searchResults = records.map(record => {

			const sobjectDescription = sobjectDescriptions.find(x => x.name === record.attributes.type);
			
			const recordCopy = camelCaseKeys(record);
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