import { Component, UnauthorizedException } from '@nestjs/common';
import { CacheFactory } from '../factories/cache-factory';
import { ICache } from '../../interfaces/ICache';
import { ApexLog } from '../../models/sobjects/ApexLog';
import * as jsforce from 'jsforce';
import { ConnectionDetails } from '../../models/ConnectionDetails';
import { QueryResult } from '../../models/query-result';
import { SobjectDescribe } from '../../models/salesforce-metadata/SobjectDescribe';
import { TraceFlag } from '../../models/sobjects/TraceFlag';
import { Debug } from '../../utilities/debug';
import { DebugLevel } from '../../models/sobjects/DebugLevel';
import * as camelCase from 'lodash.camelcase';
import * as got from 'got';

//This package is not es6 module friendly, have to import the commonjs way.
import camelCaseKeys = require('camelcase-keys');
import { CrudResult } from '../../models/sobjects/CrudResult';
import { GlobalDescribe } from '../../models/salesforce-metadata/GlobalDescribe';
import { SobjectDescribeBase } from '../../models/salesforce-metadata/SobjectDescribeBase';
import { CrudAction } from '../../models/enums/crud-action';

export class StandardSobjectService {

	private cache: ICache;
	private conn: any;
	private debug: Debug;

	constructor(private connectionDetails: ConnectionDetails) {

		this.cache = CacheFactory.getCache();

		this.conn = new jsforce.Connection({
			accessToken: connectionDetails.sessionId,
			instanceUrl: connectionDetails.instanceUrl
		});

		this.debug = new Debug('standard-sobject-service.ts');
	}

	async getApexLogs(userId: string, fieldsToQuery: string[]) : Promise<ApexLog[]> {
		
		this.debug.verbose('getApexLogs() parameters:');
		this.debug.verbose('userId', userId);
		this.debug.verbose('fieldsToQuery', fieldsToQuery);
		
		const apexLogQueryResult = await this._query(`Select ${fieldsToQuery} From ApexLog Where LogUserId = '${userId}'`);
		const apexLogRecords = apexLogQueryResult.records as ApexLog[];

		const debugLogPromises = apexLogRecords.map(async log => {
			const body = await this.getDebugLog(log.id, this.connectionDetails.orgVersion);
			return { id: log.id, body };
		});

		const debugLogs = (await Promise.all(debugLogPromises)) as any[];

		const apexLogs = apexLogRecords.map(log => {
			
			const debugLog = debugLogs.find(x => x.id === log.id);
			if(!debugLog.body) return;

			log.body = debugLog.body;
			return log;
		});

		return apexLogs.filter(log => log.body);
	}

	async getDebugLog(id: string, apiVersion: string) : Promise<string> {
		
		const response = await got(`${this.connectionDetails.instanceUrl}/services/data/v${apiVersion}/tooling/sobjects/ApexLog/${id}/Body`, {
			headers: { Authorization: `Bearer ${this.connectionDetails.sessionId}` }
		});

		return response.body;
	}

	async getTraceFlagById(id: string) : Promise<TraceFlag> {
		let traceFlag = await this.conn.tooling.sobject('TraceFlag').retrieve(id);
		traceFlag = camelCaseKeys(traceFlag, { deep: true });
		return traceFlag as TraceFlag;
	}

	async getTraceFlags(userId: string, fieldsToQuery: string[], debugLevelFieldsToQuery?: string[]) : Promise<TraceFlag[]> {
		
		this.debug.verbose('getTraceFlags() parameters:');
		this.debug.verbose('userId', userId);
		this.debug.verbose('fieldsToQuery', fieldsToQuery);

		const traceFlagQueryResult = await this._query(`Select ${fieldsToQuery} From TraceFlag Where TracedEntityId = '${userId}'`, true);
		const traceFlags = traceFlagQueryResult.records as TraceFlag[];

		const debugLevelIds = traceFlags.map(x => x.debugLevelId);
		const debugLevelFields = debugLevelFieldsToQuery || await this.getSobjectFieldNames('DebugLevel', this.connectionDetails.orgId);
		const debugLevels = await this.getDebugLevels(debugLevelIds, debugLevelFields);

		traceFlags.forEach(tf => {
			tf.debugLevel = debugLevels.find(dl => dl.id === tf.debugLevelId);
		});

		return traceFlags;
	}

	async createTraceFlag(traceFlag: TraceFlag) : Promise<CrudResult> {

		const transformedTraceFlag: any = {
			StartDate: traceFlag.startDate,
			ExpirationDate: traceFlag.expirationDate,
			DebugLevelId: traceFlag.debugLevelId,
			TracedEntityId: traceFlag.tracedEntityId,
			LogType: traceFlag.logType
		};

		return await this._create('TraceFlag', transformedTraceFlag);
	}

	async updateTraceFlag(traceFlag: TraceFlag) : Promise<CrudResult> {

		this.debug.verbose('updateTraceFlag() parameters:');
		this.debug.verbose('traceFlag', traceFlag);
		
		const transformedTraceFlag: any = {
			Id: traceFlag.id,
			StartDate: traceFlag.startDate,
			ExpirationDate: traceFlag.expirationDate,
			DebugLevelId: traceFlag.debugLevelId
		};

		return await this._update('TraceFlag', transformedTraceFlag);
	}

	async deleteTraceFlagById(id: string) : Promise<CrudResult> {
		return await this._delete('TraceFlag', id);
	}

	async getDebugLevels(ids: string[], fieldsToQuery: string[]) : Promise<DebugLevel[]> {
		
		const soqlSafeIds = `'${ids.join(`','`)}'`;
		const whereClause = ids.length > 0 ? `Where Id In (${soqlSafeIds})` : ``;

		const queryResult = await this._query(`Select ${fieldsToQuery} From DebugLevel ${whereClause}`, true);
		return queryResult.records as DebugLevel[];
	}

	async getSobjectFieldNames(sobjectName: string, orgId: string) : Promise<string[]> {

		const cacheKey = `SOBJECT_FIELD_NAMES:${orgId}:${sobjectName}`;
		const cachedValue = await this.cache.get<string[]>(cacheKey);

		if(cachedValue) return cachedValue;

		const meta = await this._describeSobject(sobjectName, orgId);
		const fieldNames = meta.fields.map(field => camelCase(field.name));

		//Cache for 12 hours
		await this.cache.set(cacheKey, fieldNames, (60 * 60 * 12));

		return fieldNames;
	}

	private async _create(sobjectName: string, data: any) : Promise<CrudResult> {
		return this._performCrudAction(sobjectName, data, CrudAction.CREATE);
	}

	private async _update(sobjectName: string, data: any) : Promise<CrudResult> {
		return this._performCrudAction(sobjectName, data, CrudAction.UPDATE);
	}

	private async _delete(sobjectName: string, data: any) : Promise<CrudResult> {
		return this._performCrudAction(sobjectName, data, CrudAction.DELETE);
	}

	private async _upsert(sobjectName: string, data: any) : Promise<CrudResult> {
		return this._performCrudAction(sobjectName, data, CrudAction.UPSERT);
	}

	private async _performCrudAction(sobjectName: string, data: any, action: CrudAction) {

		const sobject = await this._getSobjectMetadata(sobjectName);
		let result: any = null;

		if(sobject.isTooling) {
			result = await this.conn.tooling.sobject(sobjectName)[action](data);
		} else {
			result = await this.conn.sobject(sobjectName)[action](data);
		}
		
		return result as CrudResult;
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
		const allSobjects = await this._globalDescribe(this.connectionDetails.orgId);
		return allSobjects.find(sobject => sobject.name === sobjectName);
	}

	private async _describeSobject(sobjectName: string, orgId: string) : Promise<SobjectDescribe> {

		const globalDescribe = await this._globalDescribe(orgId);
		const sobject = globalDescribe.find(x => x.name === sobjectName);

		const sobjectDescription = await (sobject.isTooling ? this.conn.tooling.describe(sobjectName) : this.conn.describe(sobjectName));
		return sobjectDescription as SobjectDescribe;
	}

	private async _globalDescribe(orgId: string) : Promise<SobjectDescribeBase[]> {

		const cacheKey = `GLOBAL_SOBJECT_DESCRIBE_BY_ORG:${orgId}`;
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
	}
}