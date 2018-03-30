import { AbstractSobjectService } from './AbstractSobjectService';
import { DebugLevel } from '../../models/sobjects/DebugLevel';
import { Connection } from '../../models/Connection';

export class DebugLevelService extends AbstractSobjectService {

	constructor(connection: Connection) {
		super('DebugLevel', connection);
	}

	public async retrieve(ids: string) : Promise<DebugLevel>;
	public async retrieve(ids: string[]) : Promise<DebugLevel[]>;
	public async retrieve(ids: any) : Promise<any> {
		if(Array.isArray(ids)) return await super.retrieve<DebugLevel[]>(ids);
		return await super.retrieve<DebugLevel>(ids);
	}

	async getDebugLevels(ids: string[], fieldsToQuery: string[]) : Promise<DebugLevel[]> {
		
		const soqlSafeIds = `'${ids.join(`','`)}'`;
		const whereClause = ids.length > 0 ? `Where Id In (${soqlSafeIds})` : ``;

		const queryResult = await this.query(fieldsToQuery, whereClause);
		return queryResult.records as DebugLevel[];
	}
}