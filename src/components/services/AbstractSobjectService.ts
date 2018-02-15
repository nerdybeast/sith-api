import { UnauthorizedException } from '@nestjs/common';
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
import * as got from 'got';
import * as jsforce from 'jsforce';

//This package is not es6 module friendly, have to import the commonjs way.
import camelCaseKeys = require('camelcase-keys');

export abstract class AbstractSobjectService {

	protected sobjectName: string;
	protected connectionDetails: ConnectionDetails;
	protected cache: ICache;
	private conn: any;
	protected debug: Debug;

	constructor(sobjectName: string, connectionDetails: ConnectionDetails) {

		this.sobjectName = sobjectName;
		this.connectionDetails = connectionDetails;
		this.cache = CacheFactory.getCache();

		this.conn = new jsforce.Connection({
			accessToken: connectionDetails.sessionId,
			instanceUrl: connectionDetails.instanceUrl
		});

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

	public abstract async retrieve(id: string);

	public async query(fieldNames: string[] | string, whereClause: string) : Promise<QueryResult> {
		if(fieldNames === '*') fieldNames = await this.getSobjectFieldNames();
		const sobjectMetadata = await this._getSobjectMetadata(this.sobjectName);
		const soql = `SELECT ${fieldNames} FROM ${this.sobjectName} ${whereClause}`;
		return await this._query(soql, sobjectMetadata.isTooling);
	}

	public async create(data: any) : Promise<CrudResult> {
		return await this._create(data);
	}

	public async update(data: any) : Promise<CrudResult> {
		return await this._update(data);
	}

	public async delete(data: any) : Promise<CrudResult> {
		return await this._delete(data);
	}

	public async upsert(data: any) : Promise<CrudResult> {
		return await this._upsert(data);
	}

	protected async _retrieve<T>(id: string) : Promise<T> {
		return this._performCrudAction<T>(id, CrudAction.RETRIEVE);
	}

	protected async _create(data: any) : Promise<CrudResult> {
		return this._performCrudAction<CrudResult>(data, CrudAction.CREATE);
	}

	protected async _update(data: any) : Promise<CrudResult> {
		return this._performCrudAction<CrudResult>(data, CrudAction.UPDATE);
	}

	protected async _delete(data: any) : Promise<CrudResult> {
		return this._performCrudAction<CrudResult>(data, CrudAction.DELETE);
	}

	protected async _upsert(data: any) : Promise<CrudResult> {
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
			if(error.errorCode === 'INVALID_SESSION_ID') throw new UnauthorizedException(error.message);
			throw error;
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
			if(error.errorCode === 'INVALID_SESSION_ID') throw new UnauthorizedException(error.message);
			throw error;
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
			if(error.errorCode === 'INVALID_SESSION_ID') throw new UnauthorizedException(error.message);
			throw error;
		}
	}

	private async _globalDescribe(organizationId: string) : Promise<SobjectDescribeBase[]> {
		try {
		
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
			if(error.errorCode === 'INVALID_SESSION_ID') throw new UnauthorizedException(error.message);
			throw error;
		}
	}
}
