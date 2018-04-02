import { UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CacheFactory } from '../factories/cache-factory';
import { ICache } from '../../interfaces/ICache';
import { ConnectionDetails } from '../../models/ConnectionDetails';
import { QueryResult } from '../../models/query-result';
import { SobjectDescribe } from '../../models/salesforce-metadata/SobjectDescribe';
import { Debug } from '../../utilities/debug';
import { CrudResult } from '../../models/CrudResult';
import { GlobalDescribe } from '../../models/salesforce-metadata/GlobalDescribe';
import { SobjectDescribeBase } from '../../models/salesforce-metadata/SobjectDescribeBase';
import { CrudAction } from '../../models/enums/crud-action';
import * as camelCase from 'lodash.camelcase';
import { Connection } from '../../models/Connection';

//This package is not es6 module friendly, have to import the commonjs way.
import camelCaseKeys = require('camelcase-keys');
import { JsforceError } from '../../models/JsforceError';
import { ErrorCode } from '../../models/enums/error-code';

export abstract class AbstractSobjectService {

	protected sobjectName: string;
	protected connectionDetails: ConnectionDetails;
	protected cache: ICache;
	private conn: any;
	protected debug: Debug;

	constructor(sobjectName: string, connection: Connection) {

		this.sobjectName = sobjectName;
		this.connectionDetails = connection.details;
		this.cache = CacheFactory.getCache();

		this.conn = connection.jsforce;

		this.debug = new Debug(`${sobjectName}Service`);
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

	public async retrieve<T>(ids: string) : Promise<T>;
	public async retrieve<T>(ids: string[]) : Promise<T[]>;
	public async retrieve<T>(ids: any) : Promise<any> {
		if(Array.isArray(ids)) return this._performCrudAction<T[]>(ids, CrudAction.RETRIEVE);
		return this._performCrudAction<T>(ids, CrudAction.RETRIEVE);
	}

	public async query(fieldNames: string[] | string, whereClause?: string) : Promise<QueryResult> {
		
		if(fieldNames === '*') fieldNames = await this.getSobjectFieldNames();
		whereClause = whereClause || '';

		const sobjectMetadata = await this._getSobjectMetadata(this.sobjectName);
		const soql = `SELECT ${fieldNames} FROM ${this.sobjectName} ${whereClause}`;
		return await this._query(soql, sobjectMetadata.isTooling);
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

	private async _performCrudAction<T>(data: any, action: CrudAction) : Promise<T> {

		try {
			
			const sobjectMetadata = await this._getSobjectMetadata(this.sobjectName);
			let result: any = null;

			if(sobjectMetadata.isTooling) {
				result = await this.conn.tooling.sobject(this.sobjectName)[action](data);
			} else {
				result = await this.conn.sobject(this.sobjectName)[action](data);
			}
			
			result = camelCaseKeys(result, { deep: true });

			return result as T;

		} catch (error) {

			this.debug.error(`${action} failed for ${this.sobjectName}`);
			this.debug.error(`data`, data);
			this.debug.error(`error`, error);

			const ex: JsforceError = error;

			this.handleJsforceError(ex);
		}
	}

	private async _query(soql: string, isToolingQuery: boolean = false) : Promise<QueryResult> {
		
		this.debug.verbose(`_query() parameters:`);
		this.debug.verbose(`soql`, soql);
		this.debug.verbose(`isToolingQuery`, isToolingQuery);

		try {

			let queryResult = await (isToolingQuery ? this.conn.tooling.query(soql) : this.conn.query(soql));
			this.debug.info(`Raw query result`, queryResult);

			//1. To help be json api compliant
			//2. Some data from Salesforce comes back as camelCase, other is PascalCased, don't want to have to
			//force a mapping between these variations in our models so force camelCase here.
			queryResult = camelCaseKeys(queryResult, { deep: true });

			return queryResult as QueryResult;

		} catch (error) {

			this.debug.error(`_query() error`, error);

			const ex: JsforceError = error;

			this.handleJsforceError(ex);
		}
	}

	private async _getSobjectMetadata(sobjectName: string) : Promise<SobjectDescribeBase> {
		const allSobjects = await this._globalDescribe(this.connectionDetails.organizationId);
		return allSobjects.find(sobject => sobject.name === sobjectName);
	}

	private async _describeSobject(sobjectName: string, organizationId: string) : Promise<SobjectDescribe> {

		try {
			
			const globalDescribe = await this._globalDescribe(organizationId);
			const sobject = globalDescribe.find(x => x.name === sobjectName);

			const sobjectDescription = await (sobject.isTooling ? this.conn.tooling.describe(sobjectName) : this.conn.describe(sobjectName));
			return sobjectDescription as SobjectDescribe;

		} catch (error) {

			this.debug.error(`_describeSobject() error`, error);

			const ex: JsforceError = error;

			this.handleJsforceError(ex);
		}
	}

	private async _globalDescribe(organizationId: string) : Promise<SobjectDescribeBase[]> {
		try {
		
			this.debug.verbose(`_globalDescribe() param: organizationId`, organizationId);

			const cacheKey = `GLOBAL_SOBJECT_DESCRIBE_BY_ORG:${organizationId}`;
			const cachedValue = await this.cache.get(cacheKey) as any[];

			if(cachedValue) return cachedValue;

			const [ standardSobjectDescribe, toolingSobjectDescribe ] = await Promise.all([
				this.conn.describeGlobal() as GlobalDescribe,
				this.conn.tooling.describeGlobal() as GlobalDescribe
			]);

			standardSobjectDescribe.sobjects.forEach(sobject => {
				sobject.isTooling = true;
			});

			toolingSobjectDescribe.sobjects.forEach(sobject => {

				//A true tooling object is one that exists in the list of tooling sobjects but NOT in the list of standard sobjects.
				//Some sobjects exist in both lists which in that case, they are considered standard sobjects.
				const standardSobjectMatch = standardSobjectDescribe.sobjects.find(x => x.name === sobject.name);
				const isTooling = standardSobjectMatch === undefined;

				sobject.isTooling = isTooling;
			});

			const allSobjects = [...standardSobjectDescribe.sobjects, ...toolingSobjectDescribe.sobjects];

			//Cache for 12 hours
			await this.cache.set(cacheKey, allSobjects, (60 * 60 * 12));

			return allSobjects;

		} catch (error) {

			this.debug.error(`_globalDescribe() error`, error);

			const ex: JsforceError = error;

			this.handleJsforceError(ex);
		}
	}

	private handleJsforceError(ex: JsforceError) : void {
		if(ex.errorCode === ErrorCode.INVALID_SESSION_ID) throw new UnauthorizedException(ex.message);
		if(ex.errorCode === ErrorCode.REQUEST_LIMIT_EXCEEDED) throw new ForbiddenException(ex.message);
		throw new BadRequestException(ex.message);
	}
}
