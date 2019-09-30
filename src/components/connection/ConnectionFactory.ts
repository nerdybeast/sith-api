import { Connection } from '../../models/Connection';
import { MetadataService } from '../services/MetadataService';
import { IMetadataService } from '../services/IMetadataService';
import { IToolingService } from '../services/IToolingService';
import { ToolingService } from '../services/ToolingService';
import { CacheService } from '../cache/CacheService';

export class ConnectionFactory {

	private cacheService: CacheService;

	constructor(cacheService: CacheService) {
		this.cacheService = cacheService;
	}

	public createMetadataService(connectionDetails: Connection) : IMetadataService {
		const cacheService = this.cacheService;
		return new MetadataService(connectionDetails, cacheService);
	}

	public createToolingService(connectionDetails: Connection) : IToolingService {
		return new ToolingService(connectionDetails);
	}
}