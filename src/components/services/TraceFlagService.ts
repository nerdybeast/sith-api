import { AbstractSobjectService } from './AbstractSobjectService';
import { ConnectionDetails } from '../../models/ConnectionDetails';
import { TraceFlag } from '../../models/sobjects/TraceFlag';
import { CrudResult } from '../../models/CrudResult';
import { DebugLevelService } from './DebugLevelService';

export class TraceFlagService extends AbstractSobjectService {

	constructor(connectionDetails: ConnectionDetails) {
		super('TraceFlag', connectionDetails);
	}

	public async retrieve(id: string) : Promise<TraceFlag> {
		return await this._retrieve<TraceFlag>(id);
	}

	async getTraceFlags(userId: string, fieldsToQuery: string[], debugLevelFieldsToQuery?: string[]) : Promise<TraceFlag[]> {
		
		this.debug.verbose('getTraceFlags() parameters:');
		this.debug.verbose('userId', userId);
		this.debug.verbose('fieldsToQuery', fieldsToQuery);

		// const traceFlagQueryResult = await this._query(`Select ${fieldsToQuery} From TraceFlag Where TracedEntityId = '${userId}'`, true);
		const traceFlagQueryResult = await this.query(fieldsToQuery, `Where TracedEntityId = '${userId}'`);
		const traceFlags = traceFlagQueryResult.records as TraceFlag[];

		const debugLevelIds = traceFlags.map(x => x.debugLevelId);
		const debugLevelFields = debugLevelFieldsToQuery || await this.getSobjectFieldNames('DebugLevel');
		
		const debugLevelService = new DebugLevelService(this.connectionDetails);
		const debugLevels = await debugLevelService.getDebugLevels(debugLevelIds, debugLevelFields);

		traceFlags.forEach(tf => {
			tf.debugLevel = debugLevels.find(dl => dl.id === tf.debugLevelId);
		});

		return traceFlags;
	}

	async create(traceFlag: TraceFlag) : Promise<CrudResult> {

		const transformedTraceFlag: any = {
			StartDate: traceFlag.startDate,
			ExpirationDate: traceFlag.expirationDate,
			DebugLevelId: traceFlag.debugLevelId,
			TracedEntityId: traceFlag.tracedEntityId,
			LogType: traceFlag.logType
		};

		return await this._create(transformedTraceFlag);
	}

	async update(traceFlag: TraceFlag) : Promise<CrudResult> {

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
}