import { AbstractSobjectService } from './AbstractSobjectService';
import { ConnectionDetails } from '../../models/ConnectionDetails';
import { ApexLog } from '../../models/sobjects/ApexLog';
import * as got from 'got';

export class ApexLogService extends AbstractSobjectService {
	
	constructor(connectionDetails: ConnectionDetails) {
		super('ApexLog', connectionDetails);
	}

	public async retrieve(id: string) : Promise<ApexLog> {
		return await this._retrieve<ApexLog>(id);
	}

	async getApexLogs(userId: string, fieldsToQuery: string[]) : Promise<ApexLog[]> {
		
		this.debug.verbose('getApexLogs() parameters:');
		this.debug.verbose('userId', userId);
		this.debug.verbose('fieldsToQuery', fieldsToQuery);
		
		const apexLogQueryResult = await this.query(fieldsToQuery, `Where LogUserId = '${userId}' ORDER BY StartTime DESC LIMIT 25`);
		const apexLogRecords = apexLogQueryResult.records as ApexLog[];

		const debugLogPromises = apexLogRecords.map(async log => {
			const body = await this.getDebugLog(log.id);
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

	async getDebugLog(id: string) : Promise<string> {
		
		const response = await got(`${this.connectionDetails.instanceUrl}/services/data/v${this.connectionDetails.orgVersion}/tooling/sobjects/ApexLog/${id}/Body`, {
			headers: { Authorization: `Bearer ${this.connectionDetails.sessionId}` }
		});

		if(response.body === null || response.body === undefined) {
			response.body = '';
		}

		return response.body.trim();
	}
}