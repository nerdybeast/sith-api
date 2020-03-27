import Got from 'got';
import { Connection } from '../../models/Connection';
import { MetadataService } from '../services/MetadataService';
import { IMetadataService } from '../services/IMetadataService';
import { IToolingService } from '../services/IToolingService';
import { ToolingService } from '../services/ToolingService';
import { CacheService } from '../cache/CacheService';
import { Injectable, Inject } from '@nestjs/common';
import { ApexLogService } from '../services/ApexLogService';
import { IApexLogService } from '../services/IApexLogService';
import { GenericSobjectService } from '../services/GenericSobjectService';
import { IGenericSobjectService } from '../services/IGenericSobjectService';
import { IDebugLevelService } from '../services/IDebugLevelService';
import { DebugLevelService } from '../services/DebugLevelService';
import { ITraceFlagService } from '../services/ITraceFlagService';
import { TraceFlagService } from '../services/TraceFlagService';
import { DebugFactory } from '../../third-party-modules/debug/DebugFactory';

@Injectable()
export class ConnectionFactory {

	private cacheService: CacheService;
	private got: typeof Got;
	private debugFactory: DebugFactory;

	constructor(cacheService: CacheService, @Inject('got') got: typeof Got, debugFactory: DebugFactory) {
		this.cacheService = cacheService;
		this.got = got;
		this.debugFactory = debugFactory;
	}

	public createMetadataService(connection: Connection) : IMetadataService {
		return new MetadataService(connection, this.cacheService);
	}

	public createToolingService(connection: Connection) : IToolingService {
		return new ToolingService(connection, this.cacheService, this.debugFactory);
	}

	public createApexLogService(connection: Connection) : IApexLogService {
		return new ApexLogService(connection, this.cacheService, this.got, this.debugFactory);
	}

	public createGenericSobjectService(sobjectName: string, connection: Connection) : IGenericSobjectService {
		return new GenericSobjectService(sobjectName, connection, this.cacheService, this.debugFactory);
	}

	public createDebugLevelService(connection: Connection) : IDebugLevelService {
		return new DebugLevelService(connection, this.cacheService, this.debugFactory);
	}

	public createTraceFlagService(connection: Connection, debugLevelService: IDebugLevelService) : ITraceFlagService {
		return new TraceFlagService(connection, this.cacheService, debugLevelService, this.debugFactory);
	}
}