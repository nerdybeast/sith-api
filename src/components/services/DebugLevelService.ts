import { AbstractSobjectService } from './AbstractSobjectService';
import { DebugLevel } from '../../models/sobjects/DebugLevel';
import { Connection } from '../../models/Connection';
import { ICache } from '../../interfaces/ICache';
import { IDebugLevelService } from './IDebugLevelService';

export class DebugLevelService extends AbstractSobjectService<DebugLevel> implements IDebugLevelService {

	constructor(connection: Connection, cache: ICache) {
		super('DebugLevel', connection, cache);
	}

	async getDebugLevels(ids: string[], fieldsToQuery: string[]) : Promise<DebugLevel[]> {
		
		const soqlSafeIds = `'${ids.join(`','`)}'`;
		const whereClause = ids.length > 0 ? `Where Id In (${soqlSafeIds})` : ``;

		const queryResult = await this.query(fieldsToQuery, whereClause);
		return queryResult.records as DebugLevel[];
	}
}