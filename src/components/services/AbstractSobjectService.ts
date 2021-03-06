//These packages are not es6 module friendly, have to import the commonjs way.
import camelCaseKeys = require('camelcase-keys');
import camelCase = require('lodash.camelcase');

import { UnauthorizedException, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { ICache } from '../../interfaces/ICache';
import { ConnectionDetails } from '../../models/ConnectionDetails';
import { QueryResult } from '../../models/query-result';
import { SobjectDescribe } from '../../models/salesforce-metadata/SobjectDescribe';
import { CrudResult } from '../../models/CrudResult';
import { SobjectDescribeBase } from '../../models/salesforce-metadata/SobjectDescribeBase';
import { CrudAction } from '../../models/enums/crud-action';
import { Connection } from '../../models/Connection';
import { JsforceError } from '../../models/JsforceError';
import { ErrorCode } from '../../models/enums/error-code';
import { Sobject } from '../../models/sobjects/Sobject';
import { SearchResult } from '../../models/SearchResult';
import { SalesforceService } from './SalesforceService';
import { ApiType } from '../../models/enums/ApiType';
import { CacheDurationEnum } from '../../utilities/cache-helpers/CacheDurationEnum';
import { DebugFactory } from '../../third-party-modules/debug/DebugFactory';
import { DebugService } from '../../third-party-modules/debug/DebugService';

export abstract class AbstractSobjectService<T extends Sobject> extends SalesforceService<T> {

	protected sobjectName: string;
	protected connectionDetails: ConnectionDetails;
	protected cache: ICache;
	protected conn: any;
	protected debugService: DebugService;

	constructor(sobjectName: string, connection: Connection, cache: ICache, debugFactory: DebugFactory) {

		super(connection);

		this.sobjectName = sobjectName;
		this.connectionDetails = connection.details;
		this.cache = cache;

		this.conn = connection.jsforce;

		this.debugService = debugFactory.create(`${sobjectName}Service`);
	}

	public async getSobjectFieldNames(sobjectName?: string) : Promise<string[]> {

		sobjectName = sobjectName || this.sobjectName;

		const cacheKey = `SOBJECT_FIELD_NAMES:${this.connectionDetails.organizationId}:${sobjectName}`;
		const cachedValue = await this.cache.get<string[]>(cacheKey);

		if(cachedValue) return cachedValue;

		const meta = await this._describeSobject(sobjectName, this.connectionDetails.organizationId);
		const fieldNames = meta.fields.map(field => camelCase(field.name));

		//Cache for 12 hours
		await this.cache.set(cacheKey, fieldNames, (60 * 60 * 12));

		return fieldNames;
	}
	
	public async query(fieldNames: string[] | string, whereClause?: string) : Promise<QueryResult<T>> {
		
		if(fieldNames === '*') fieldNames = await this.getSobjectFieldNames();
		whereClause = whereClause || '';
		
		const sobjectMetadata = await this._describeSobjectBase(this.sobjectName);
		const soql = `SELECT ${fieldNames} FROM ${this.sobjectName} ${whereClause}`;
		return await this._query(soql, sobjectMetadata.isTooling);
	}
	
	public async search(sosl: string) : Promise<T[]> {
		const result = await this._search(sosl);
		return result.searchRecords;
	}

	public async retrieve(ids: string) : Promise<T>;
	public async retrieve(ids: string[]) : Promise<T[]>;
	public async retrieve(ids: any) : Promise<any> {
		if(Array.isArray(ids)) return this._performCrudAction<T[]>(ids, CrudAction.RETRIEVE);
		return this._performCrudAction<T>(ids, CrudAction.RETRIEVE);
	}

	public async create(data: any) : Promise<CrudResult>;
	public async create(data: any[]) : Promise<CrudResult[]>;
	public async create(data: any) : Promise<any> {
		if(Array.isArray(data)) return this._performCrudAction<CrudResult[]>(data, CrudAction.CREATE);
		return this._performCrudAction<CrudResult>(data, CrudAction.CREATE);
	}

	public async update(data: any) : Promise<CrudResult>;
	public async update(data: any[]) : Promise<CrudResult[]>;
	public async update(data: any) : Promise<any> {
		if(Array.isArray(data)) return this._performCrudAction<CrudResult[]>(data, CrudAction.UPDATE);
		return this._performCrudAction<CrudResult>(data, CrudAction.UPDATE);
	}

	public async delete(ids: string) : Promise<CrudResult>;
	public async delete(ids: string[]) : Promise<CrudResult[]>;
	public async delete(ids: any) : Promise<any> {
		if(Array.isArray(ids)) return this._performCrudAction<CrudResult[]>(ids, CrudAction.DELETE);
		return this._performCrudAction<CrudResult>(ids, CrudAction.DELETE);
	}

	public async upsert(data: any) : Promise<CrudResult>;
	public async upsert(data: any[]) : Promise<CrudResult[]>;
	public async upsert(data: any) : Promise<any> {
		if(Array.isArray(data)) return this._performCrudAction<CrudResult[]>(data, CrudAction.UPSERT);
		return this._performCrudAction<CrudResult>(data, CrudAction.UPSERT);
	}

	private async _performCrudAction<U>(data: any, action: CrudAction) : Promise<U> {

		this.debugService.verbose(`_performCrudAction() parameters:`, { data, action });

		try {

			const sobjectBaseMetadata = await this._describeSobjectBase(this.sobjectName);

			const apiType = sobjectBaseMetadata.isTooling ? ApiType.TOOLING : ApiType.STANDARD;
			let result: any = await this.sobjectCrudOperation(apiType, this.sobjectName, action, data);

			result = camelCaseKeys(result, { deep: true });

			return result as U;

		} catch (error) {

			this.debugService.error(`${action} failed for ${this.sobjectName}`, { data, error });

			const ex: JsforceError = error;
			this.handleJsforceError(ex);
		}
	}

	private async _query(soql: string, isToolingQuery: boolean = false) : Promise<QueryResult<T>> {

		this.debugService.verbose(`_query() parameters:`, { soql, isToolingQuery });

		try {

			let queryResult: any = await (isToolingQuery ? this.toolingQuery(soql) : this.standardQuery(soql));
			this.debugService.verbose(`Raw query result`, queryResult);

			//1. To help be json api compliant
			//2. Some data from Salesforce comes back as camelCase, other is PascalCased, don't want to have to
			//force a mapping between these variations in our models so force camelCase here.
			queryResult = camelCaseKeys(queryResult, { deep: true });

			return queryResult as QueryResult<T>;

		} catch (error) {

			this.debugService.error(`_query() error`, error);
			const ex: JsforceError = error;
			this.handleJsforceError(ex);
		}
	}

	private async _search(sosl: string, isTooling: boolean = false) : Promise<SearchResult<T>> {

		this.debugService.verbose(`_search() parameters:`, { sosl, isTooling });

		try {

			//let searchResult = await (isTooling ? this.conn.tooling.search(sosl) : this.conn.search(sosl));
			let searchResult: any = await (isTooling ? this.toolingSearch(sosl) : this.standardSearch(sosl));
			this.debugService.verbose(`Raw search result`, searchResult);

			searchResult = camelCaseKeys(searchResult as any, { deep: true });

			//return searchResult as SearchResult;
			return searchResult;

		} catch (error) {

			this.debugService.error(`_search() error`, error);
			const ex: JsforceError = error;
			this.handleJsforceError(ex);
		}
	}

	private async _describeSobjectBase(sobjectName: string) : Promise<SobjectDescribeBase> {
		const allSobjects = await this._globalDescribe(this.connectionDetails.organizationId);
		return allSobjects.find(sobject => sobject.name === sobjectName);
	}

	protected async _describeSobject(sobjectName: string, organizationId: string, force: boolean = false) : Promise<SobjectDescribe> {

		this.debugService.verbose(`_describeSobject() parameters:`, { sobjectName, organizationId });

		try {
			
			const globalDescribe = await this._globalDescribe(organizationId);
			const sobject = globalDescribe.find(x => x.name === sobjectName);

			if(!sobject) {
				throw new JsforceError(ErrorCode.NOT_FOUND, `The sobject "${sobjectName}" was not found in the current Salesforce org (${organizationId}).`);
			}

			const cacheKey = `SOBJECT_DESCRIBE_BY_ORG:${organizationId}:${sobjectName}`;
			const cachedValue = await this.cache.get(cacheKey) as SobjectDescribe;

			if(cachedValue && !force) return cachedValue;

			const sobjectDescription = await (sobject.isTooling ? this.conn.tooling.describe(sobjectName) : this.conn.describe(sobjectName));

			await this.cache.set(cacheKey, sobjectDescription, CacheDurationEnum.HOURS_12);

			return sobjectDescription as SobjectDescribe;

		} catch (error) {

			this.debugService.error(`_describeSobject() error`, error);
			const ex: JsforceError = error;
			this.handleJsforceError(ex);
		}
	}

	protected async _globalDescribe(organizationId: string) : Promise<SobjectDescribeBase[]> {

		this.debugService.verbose(`_globalDescribe() parameters:`, { organizationId });

		try {

			const cacheKey = `GLOBAL_DESCRIBE_BY_ORG:${organizationId}`;
			const cachedValue = await this.cache.get(cacheKey) as SobjectDescribeBase[];

			if(cachedValue) return cachedValue;

			const [ standardSobjectDescribe, toolingSobjectDescribe ] = await Promise.all([
				this.standardGlobalDescribe(),
				this.toolingGlobalDescribe()
			]);

			standardSobjectDescribe.sobjects.forEach(sobject => sobject.isTooling = false);
			toolingSobjectDescribe.sobjects.forEach(sobject => sobject.isTooling = true);

			const allSobjects = [...standardSobjectDescribe.sobjects, ...toolingSobjectDescribe.sobjects];

			await this.cache.set(cacheKey, allSobjects, CacheDurationEnum.HOURS_12);

			return allSobjects;

		} catch (error) {

			this.debugService.error(`_globalDescribe() error`, error);
			const ex: JsforceError = error;
			this.handleJsforceError(ex);
		}
	}

	private handleJsforceError(ex: JsforceError) : void {
		if(ex.errorCode === ErrorCode.INVALID_SESSION_ID) throw new UnauthorizedException(ex.message);
		if(ex.errorCode === ErrorCode.REQUEST_LIMIT_EXCEEDED) throw new ForbiddenException(ex.message);
		if(ex.errorCode === ErrorCode.NOT_FOUND) throw new NotFoundException(ex.message);
		throw new BadRequestException(ex.message);
	}
}
