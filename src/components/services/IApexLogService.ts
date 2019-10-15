import { ApexLog } from '../../models/sobjects/ApexLog';
import { IAbstractSobjectService } from './IAbstractSobjectService';

export interface IApexLogService extends IAbstractSobjectService<ApexLog> {
	getByUserId(userId: string, fieldsToQuery: string[], limit?: number) : Promise<ApexLog[]>;
	attachBody(apexLogRecords: ApexLog[]) : Promise<ApexLog[]>;
	getApexLogs(userId: string, fieldsToQuery: string[], limit?: number) : Promise<ApexLog[]>;
	getDebugLog(id: string) : Promise<string>;
}