import { Component } from '@nestjs/common';
import { ICache } from '../../interfaces/ICache';
import { MemoryCache } from '../services/memory-cache-service';

@Component()
export class CacheFactory {

	private static cacheInstance: ICache;

	public static getCache() : ICache {
		//TODO: decide to return redis cache or not...
		if(!this.cacheInstance) this.cacheInstance = new MemoryCache();
		return this.cacheInstance;
	}

}