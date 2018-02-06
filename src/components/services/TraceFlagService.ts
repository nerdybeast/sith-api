import { AbstractSobjectService } from './AbstractSobjectService';
import { ConnectionDetails } from '../../models/ConnectionDetails';
import { TraceFlag } from '../../models/sobjects/TraceFlag';
import { CrudResult } from '../../models/CrudResult';
import { DebugLevelService } from './DebugLevelService';
import * as jsonapi from 'jsonapi-serializer';

export class TraceFlagService extends AbstractSobjectService {

	constructor(connectionDetails: ConnectionDetails) {
		super('TraceFlag', connectionDetails);
	}

	public async retrieve(id: string) : Promise<TraceFlag> {
		return await this._retrieve<TraceFlag>(id);
	}

	public async getTraceFlags(userId: string, fieldsToQuery?: string[], debugLevelFieldsToQuery?: string[]) : Promise<TraceFlag[]> {
		
		this.debug.verbose('getTraceFlags() parameters:');
		this.debug.verbose('userId', userId);
		this.debug.verbose('fieldsToQuery', fieldsToQuery);

		fieldsToQuery = fieldsToQuery || await this.getSobjectFieldNames();
		const traceFlagQueryResult = await this.query(fieldsToQuery, `Where TracedEntityId = '${userId}'`);
		const traceFlags = traceFlagQueryResult.records as TraceFlag[];

		const debugLevelIds = traceFlags.map(x => x.debugLevelId);
		debugLevelFieldsToQuery = debugLevelFieldsToQuery || await this.getSobjectFieldNames('DebugLevel');
		
		const debugLevelService = new DebugLevelService(this.connectionDetails);
		const debugLevels = await debugLevelService.getDebugLevels(debugLevelIds, debugLevelFieldsToQuery);

		traceFlags.forEach(tf => {
			tf.debugLevel = debugLevels.find(dl => dl.id === tf.debugLevelId);
		});

		return traceFlags;
	}

	public async create(traceFlag: TraceFlag) : Promise<CrudResult> {

		const transformedTraceFlag: any = {
			StartDate: traceFlag.startDate,
			ExpirationDate: traceFlag.expirationDate,
			DebugLevelId: traceFlag.debugLevelId,
			TracedEntityId: traceFlag.tracedEntityId,
			LogType: traceFlag.logType
		};

		return await this._create(transformedTraceFlag);
	}

	public async update(traceFlag: TraceFlag) : Promise<CrudResult> {

		this.debug.verbose('updateTraceFlag() parameters:');
		this.debug.verbose('traceFlag', traceFlag);
		
		const transformedTraceFlag: any = {
			Id: traceFlag.id,
			StartDate: traceFlag.startDate,
			ExpirationDate: traceFlag.expirationDate,
			DebugLevelId: traceFlag.debugLevelId
		};

		return await this._update(transformedTraceFlag);
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
}