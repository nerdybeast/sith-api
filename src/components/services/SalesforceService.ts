import { Connection } from '../../models/Connection';
import { GlobalDescribe } from '../../models/salesforce-metadata/GlobalDescribe';
import { DescribeMetadataResult } from '../../models/salesforce-metadata/DescribeMetadataResult';
import { SearchResult } from '../../models/SearchResult';
import { QueryResult } from '../../models/query-result';
import { Debug } from '../../utilities/debug';
import { ApiType } from '../../models/enums/ApiType';
import { CrudAction } from '../../models/enums/crud-action';
import { Sobject } from '../../models/sobjects/Sobject';
import { FileProperties } from '../../models/salesforce-metadata/FileProperties';

export abstract class SalesforceService<T extends Sobject> {

	protected conn: any;
	protected debug: Debug;

	constructor(protected connection: Connection) {
		this.conn = connection.jsforce;
		this.debug = new Debug(`SalesforceService`);
	}

	protected async standardGlobalDescribe() : Promise<GlobalDescribe> {
		return await this.conn.describeGlobal();
	}

	protected async toolingGlobalDescribe() : Promise<GlobalDescribe> {
		return await this.conn.tooling.describeGlobal();
	}

	protected async metadataGlobalDescribe(apiVersion: string) : Promise<DescribeMetadataResult> {
		return await this.conn.metadata.describe();
	}

	protected async standardSearch(sosl: string) : Promise<SearchResult<T>> {
		return await this.conn.search(sosl);
	}

	protected async toolingSearch(sosl: string) : Promise<SearchResult<T>> {
		return await this.conn.tooling.search(sosl);
	}

	protected async standardQuery(soql: string) : Promise<QueryResult<T>> {
		return await this.conn.query(soql);
	}

	protected async toolingQuery(soql: string) : Promise<QueryResult<T>> {
		return await this.conn.tooling.query(soql);
	}

	protected async sobjectCrudOperation(apiType: ApiType, sobjectName: string, action: CrudAction, data: any) : Promise<T> {
		if(apiType === ApiType.STANDARD) return await this.conn.sobject(sobjectName)[action](data);
		if(apiType === ApiType.TOOLING) return await this.conn.tooling.sobject(sobjectName)[action](data);
		throw new Error(`No sobject crud operations allowed for the api type ${apiType}`);
	}

	/**
	 * https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_listmetadata.htm
	 * @param type 
	 */
	protected async listMetadata(type: string) : Promise<FileProperties[]> {
		return await this.conn.metadata.list({ type });
	}

	/**
	 * https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_readMetadata.htm
	 * @param metadataObject 
	 * @param metadataTypes 
	 */
	protected async readMetadataByObject<U>(metadataObject: string, metadataTypes: string) : Promise<U>;
	protected async readMetadataByObject<U>(metadataObject: string, metadataTypes: string[]) : Promise<U[]>;
	protected async readMetadataByObject(metadataObject: string, metadataTypes: any) : Promise<any> {
		return (await this.conn.metadata.read(metadataObject, metadataTypes));
	}
}
