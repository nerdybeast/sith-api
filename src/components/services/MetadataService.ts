import { SalesforceService } from '../services/SalesforceService';
import { Connection } from '../../models/Connection';
import { CustomObjectReadResult } from '../../models/salesforce-metadata/CustomObjectReadResult';
import { ICache } from '../../interfaces/ICache';
import { FileProperties } from '../../models/salesforce-metadata/FileProperties';
import { CacheKeys } from '../../utilities/cache-helpers/CacheKeys';
import { CacheDurationEnum } from '../../utilities/cache-helpers/CacheDurationEnum';
import { IMetadataService } from './IMetadataService';
import { CacheService } from '../cache/CacheService';

export class MetadataService extends SalesforceService implements IMetadataService {

	protected connection: Connection;
	private cache: ICache;

	constructor(connection: Connection, cache: CacheService) {
		super(connection);
		this.connection = connection;
		this.cache = cache;
	}

	public async listCustomObjectTypes() {

		let listResult = await this.listMetadata<FileProperties[]>('CustomObject');
		listResult = listResult.map(x => new FileProperties(x));

		return listResult;
	}

	public async readSobjectMetadata(sobjectName: string, force: boolean = false) : Promise<CustomObjectReadResult> {

		const cacheKey = `SOBJECT_METADATA:${this.connection.details.organizationId}:${sobjectName}`;
		const cachedValue = await this.cache.get<CustomObjectReadResult>(cacheKey);

		if(cachedValue && !force) return cachedValue;

		let readResult = await this.readMetadataByObject<CustomObjectReadResult>('CustomObject', sobjectName);
		readResult = new CustomObjectReadResult(readResult);

		await this.cache.set(cacheKey, readResult, CacheDurationEnum.HOURS_12);

		return readResult;
	}

	public async sobjectHasChanged(sobjectName: string, fileProperties: FileProperties = null) : Promise<boolean> {

		if(fileProperties === null) {
			fileProperties = (await this.listCustomObjectTypes()).find(x => x.fullName === sobjectName);
		}

		const cacheKey = CacheKeys.sobjectFileProperties(this.connection.details.organizationId, sobjectName);
		const cachedFileProperties = await this.cache.get<FileProperties>(cacheKey);

		const hasChanged = cachedFileProperties === null || fileProperties.lastModifiedDate.diff(cachedFileProperties.lastModifiedDate) !== 0;

		if(hasChanged) await this.cache.set(cacheKey, fileProperties, CacheDurationEnum.DAYS_1);

		return hasChanged;
	}
}