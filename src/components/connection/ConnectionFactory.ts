import { Connection } from '../../models/Connection';
import { MetadataService } from '../services/MetadataService';
import { IMetadataService } from '../services/IMetadataService';
import { IToolingService } from '../services/IToolingService';
import { ToolingService } from '../services/ToolingService';
import { CacheService } from '../cache/CacheService';
import { Injectable } from '@nestjs/common';
import { ApexLogService } from '../services/ApexLogService';
import { IApexLogService } from '../services/IApexLogService';

@Injectable()
export class ConnectionFactory {

	private cacheService: CacheService;

	constructor(cacheService: CacheService) {
		this.cacheService = cacheService;
	}

	public createMetadataService(connection: Connection) : IMetadataService {
		const cacheService = this.cacheService;
		return new MetadataService(connection, cacheService);
	}

	public createToolingService(connection: Connection) : IToolingService {
		return new ToolingService(connection);
	}

	public createApexLogService(connection: Connection) : IApexLogService {
		return new ApexLogService(connection);
	}
}