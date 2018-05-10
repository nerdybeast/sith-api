import { Component } from '@nestjs/common';
import { ICache } from '../../interfaces/ICache';
import { MemoryCache } from '../services/memory-cache-service';
import { Debug } from '../../utilities/debug';

@Component()
export class CacheFactory {

	private static cacheInstance: ICache;

	public static getCache() : ICache {

		const debug = new Debug('CacheFactory');

		//TODO: decide to return redis cache or not...
		if(!this.cacheInstance) {
			this.cacheInstance = new MemoryCache();
			debug.verbose(`new cache instance created`);
		} else {
			debug.verbose(`same cache instance used`);
		}

		return this.cacheInstance;
	}

}