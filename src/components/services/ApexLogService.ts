import { AbstractSobjectService } from './AbstractSobjectService';
import { ApexLog } from '../../models/sobjects/ApexLog';
import got from 'got';
import { Connection } from '../../models/Connection';
import { ICache } from '../../interfaces/ICache';

export class ApexLogService extends AbstractSobjectService {

	constructor(connection: Connection, cache: ICache) {
		super('ApexLog', connection, cache);
	}

	public async retrieve(ids: string) : Promise<ApexLog>;
	public async retrieve(ids: string[]) : Promise<ApexLog[]>;
	public async retrieve(ids: any) : Promise<any> {
		if(Array.isArray(ids)) return await super.retrieve<ApexLog[]>(ids);
		return await super.retrieve<ApexLog>(ids);
	}

	async getByUserId(userId: string, fieldsToQuery: string[], limit: number = 25) : Promise<ApexLog[]> {
		const apexLogQueryResult = await this.query(fieldsToQuery, `Where LogUserId = '${userId}' ORDER BY StartTime DESC LIMIT ${limit}`);
		const apexLogRecords = apexLogQueryResult.records as ApexLog[];
		return apexLogRecords;
	}

	async attachBody(apexLogRecords: ApexLog[]) : Promise<ApexLog[]> {

		const debugLogPromises = apexLogRecords.map(async log => {
			const body = await this.getDebugLog(log.id);
			return { id: log.id, body };
		});

		const debugLogs = (await Promise.all(debugLogPromises)) as any[];

		const apexLogs = apexLogRecords.map(log => {
			const debugLog = debugLogs.find(x => x.id === log.id);
			if(debugLog.body) log.body = debugLog.body;
			return log;
		});

		return apexLogs;
	}

	async getApexLogs(userId: string, fieldsToQuery: string[], limit?: number) : Promise<ApexLog[]> {
		
		this.debug.verbose('getApexLogs() parameters:');
		this.debug.verbose('userId', userId);
		this.debug.verbose('fieldsToQuery', fieldsToQuery);
		
		const apexLogRecords = await this.getByUserId(userId, fieldsToQuery, limit);
		const apexLogs = await this.attachBody(apexLogRecords);

		return apexLogs.filter(log => log.body);
	}

	async getDebugLog(id: string) : Promise<string> {
		try {
			
			const response = await got.get(`${this.connectionDetails.instanceUrl}/services/data/v${this.connectionDetails.orgVersion}/tooling/sobjects/ApexLog/${id}/Body`, {
				headers: { Authorization: `Bearer ${this.connectionDetails.sessionId}` }
			});
	
			if(response.body === null || response.body === undefined) {
				response.body = '';
			}
	
			return response.body.trim();

		} catch (error) {
			this.debug.error(`Error fetching the debug log body for "${id}"`, error);
			throw error;
		}
	}
}