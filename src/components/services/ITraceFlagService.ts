import { IAbstractSobjectService } from './IAbstractSobjectService';
import { TraceFlag } from '../../models/sobjects/TraceFlag';
import { CrudResult } from '../../models/CrudResult';

export interface ITraceFlagService extends IAbstractSobjectService {
	getTraceFlags(userId: string, fieldsToQuery?: string[], debugLevelFieldsToQuery?: string[]) : Promise<TraceFlag[]>;
	create(traceFlags: TraceFlag) : Promise<CrudResult>;
	create(traceFlags: TraceFlag[]) : Promise<CrudResult[]>;
	create(traceFlags: any) : Promise<any>;
	update(traceFlags: TraceFlag) : Promise<CrudResult>;
	update(traceFlags: TraceFlag[]) : Promise<CrudResult[]>;
	update(traceFlags: any) : Promise<any>;
}