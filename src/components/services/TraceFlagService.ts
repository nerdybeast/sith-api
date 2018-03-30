import { AbstractSobjectService } from './AbstractSobjectService';
import { TraceFlag } from '../../models/sobjects/TraceFlag';
import { CrudResult } from '../../models/CrudResult';
import { DebugLevelService } from './DebugLevelService';
import * as jsonapi from 'jsonapi-serializer';
import { Connection } from '../../models/Connection';
import { ConnectionDetails } from '../../models/ConnectionDetails';

export class TraceFlagService extends AbstractSobjectService {

	constructor(private connection: Connection) {
		super('TraceFlag', connection);
	}

	public async retrieve(ids: string) : Promise<TraceFlag>;
	public async retrieve(ids: string[]) : Promise<TraceFlag[]>;
	public async retrieve(ids: any) : Promise<any> {
		if(Array.isArray(ids)) return await super.retrieve<TraceFlag[]>(ids);
		return await super.retrieve<TraceFlag>(ids);
	}

	public async getTraceFlags(userId: string, fieldsToQuery?: string[], debugLevelFieldsToQuery?: string[]) : Promise<TraceFlag[]> {
		
		this.debug.verbose('getTraceFlags() parameters:');
		this.debug.verbose('userId', userId);
		this.debug.verbose('fieldsToQuery', fieldsToQuery);

		fieldsToQuery = fieldsToQuery || await this.getSobjectFieldNames();
		const traceFlagQueryResult = await this.query(fieldsToQuery, `Where TracedEntityId = '${userId}' Or CreatedById = '${userId}'`);
		const traceFlags = traceFlagQueryResult.records as TraceFlag[];

		const debugLevelIds = traceFlags.map(x => x.debugLevelId);
		debugLevelFieldsToQuery = debugLevelFieldsToQuery || await this.getSobjectFieldNames('DebugLevel');
		
		const debugLevelService = new DebugLevelService(this.connection);
		const debugLevels = await debugLevelService.getDebugLevels(debugLevelIds, debugLevelFieldsToQuery);

		traceFlags.forEach(tf => {
			tf.debugLevel = debugLevels.find(dl => dl.id === tf.debugLevelId);
		});

		return traceFlags;
	}

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

	public async update(traceFlags: TraceFlag) : Promise<CrudResult>;
	public async update(traceFlags: TraceFlag[]) : Promise<CrudResult[]>;
	public async update(traceFlags: any) : Promise<any> {

		this.debug.verbose('updateTraceFlag() parameters:');
		this.debug.verbose('traceFlags', traceFlags);

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