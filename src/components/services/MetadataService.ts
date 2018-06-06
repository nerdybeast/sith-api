import { SalesforceService } from './SalesforceService';
import { Connection } from '../../models/Connection';
import { CustomObjectReadResult } from '../../models/salesforce-metadata/CustomObjectReadResult';
import { ICache } from '../../interfaces/ICache';
import { CacheFactory } from '../factories/cache-factory';

export class MetadataService extends SalesforceService {

	private cache: ICache;

	constructor(protected connection: Connection) {
		super(connection);
		this.cache = CacheFactory.getCache();
	}

	public async readSobjectMetadata(sobjectName: string) : Promise<CustomObjectReadResult> {

		const cacheKey = `SOBJECT_METADATA:${this.connection.details.organizationId}:${sobjectName}`;
		const cachedValue = await this.cache.get<CustomObjectReadResult>(cacheKey);

		if(cachedValue) return cachedValue;

		let readResult = await this.readMetadataByObject<CustomObjectReadResult>('CustomObject', sobjectName);
		readResult = new CustomObjectReadResult(readResult);

		//Cache for 12 hours
		await this.cache.set(cacheKey, readResult, (60 * 60 * 12));

		return readResult;
	}
}