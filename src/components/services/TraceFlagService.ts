import { AbstractSobjectService } from './AbstractSobjectService';
import { TraceFlag } from '../../models/sobjects/TraceFlag';
import { CrudResult } from '../../models/CrudResult';
import jsonapi from 'jsonapi-serializer';
import { Connection } from '../../models/Connection';
import { ICache } from '../../interfaces/ICache';
import { ITraceFlagService } from './ITraceFlagService';
import { IDebugLevelService } from './IDebugLevelService';
import { DebugFactory } from '../../third-party-modules/debug/DebugFactory';

export class TraceFlagService extends AbstractSobjectService<TraceFlag> implements ITraceFlagService {

	private readonly _debugLevelService: IDebugLevelService;

	constructor(connection: Connection, cache: ICache, debugLevelService: IDebugLevelService, debugFactory: DebugFactory) {
		super('TraceFlag', connection, cache, debugFactory);
		this._debugLevelService = debugLevelService;
	}

	public async getTraceFlags(userId: string, fieldsToQuery?: string[], debugLevelFieldsToQuery?: string[]) : Promise<TraceFlag[]> {

		this.debugService.verbose('getTraceFlags() parameters:', { userId, fieldsToQuery });

		fieldsToQuery = fieldsToQuery || await this.getSobjectFieldNames();
		const traceFlagQueryResult = await this.query(fieldsToQuery, `Where TracedEntityId = '${userId}' Or CreatedById = '${userId}'`);
		const traceFlags = traceFlagQueryResult.records;

		const debugLevelIds = traceFlags.map(x => x.debugLevelId);
		debugLevelFieldsToQuery = debugLevelFieldsToQuery || await this.getSobjectFieldNames('DebugLevel');
		
		const debugLevels = await this._debugLevelService.getDebugLevels(debugLevelIds, debugLevelFieldsToQuery);

		traceFlags.forEach(tf => {
			tf.debugLevel = debugLevels.find(dl => dl.id === tf.debugLevelId);
		});

		return traceFlags;
	}

	/**
	 * Overrides the basic sobject create method because trace flags have to be created a certain way
	 * @param traceFlags The trace flags to be created
	 */
	public async create(traceFlags: TraceFlag) : Promise<CrudResult>;
	public async create(traceFlags: TraceFlag[]) : Promise<CrudResult[]>;
	public async create(traceFlags: any) : Promise<any> {

		if(Array.isArray(traceFlags)) {
			traceFlags = traceFlags.map(tf => this.transformForCreate(tf));
		} else {
			traceFlags = this.transformForCreate(traceFlags);
		}

		return await super.create(traceFlags);
	}

	/**
	 * Overrides the default sobject update method because trace flags have to be updated a certain way.
	 * @param traceFlags The trace flags to be updated
	 */
	public async update(traceFlags: TraceFlag) : Promise<CrudResult>;
	public async update(traceFlags: TraceFlag[]) : Promise<CrudResult[]>;
	public async update(traceFlags: any) : Promise<any> {

		this.debugService.verbose('updateTraceFlag() parameters:', { traceFlags });

		if(Array.isArray(traceFlags)) {
			traceFlags = traceFlags.map(tf => this.transformForUpdate(tf));
		} else {
			traceFlags = this.transformForUpdate(traceFlags);
		}

		return await super.update(traceFlags);
	}

	public static serializeToJsonApi(traceFlags: TraceFlag[], traceFlagFieldNames: string[], debugLevelFieldNames: string[]) {
		
		const data = new jsonapi.Serializer('trace-flag', {
			attributes: [...traceFlagFieldNames, 'debugLevel'],
			keyForAttribute: 'camelCase',
			typeForAttribute(attr) {
				switch(attr) {
					case 'debugLevel': return 'debug-level';
					default: return attr;
				}
			},
			debugLevel: {
				ref: 'id',
				attributes: debugLevelFieldNames
			}
		}).serialize(traceFlags);

		return data;
	}

	private transformForCreate(traceFlag: TraceFlag) : any {

		const transformedTraceFlag: any = {
			StartDate: traceFlag.startDate,
			ExpirationDate: traceFlag.expirationDate,
			DebugLevelId: traceFlag.debugLevelId,
			TracedEntityId: traceFlag.tracedEntityId,
			LogType: traceFlag.logType
		};

		return transformedTraceFlag;
	}

	private transformForUpdate(traceFlag: TraceFlag) : any {

		const transformedTraceFlag: any = {
			Id: traceFlag.id,
			StartDate: traceFlag.startDate,
			ExpirationDate: traceFlag.expirationDate,
			DebugLevelId: traceFlag.debugLevelId
		};

		return transformedTraceFlag;
	}
}