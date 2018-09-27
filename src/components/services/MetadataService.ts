import { SalesforceService } from './SalesforceService';
import { Connection } from '../../models/Connection';
import { CustomObjectReadResult } from '../../models/salesforce-metadata/CustomObjectReadResult';
import { ICache } from '../../interfaces/ICache';
import { CacheFactory } from '../factories/cache-factory';
import { FileProperties } from '../../models/salesforce-metadata/FileProperties';
import { CacheKeys } from '../../utilities/cache-helpers/CacheKeys';
import { CacheDurationEnum } from '../../utilities/cache-helpers/CacheDurationEnum';

export class MetadataService extends SalesforceService {

	private cache: ICache;

	constructor(protected connection: Connection) {
		super(connection);
		this.cache = CacheFactory.getCache();
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