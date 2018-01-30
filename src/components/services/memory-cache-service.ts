import { Component } from '@nestjs/common';
import { ICache } from '../../interfaces/ICache';
import { Debug } from '../../utilities/debug';

@Component()
export class MemoryCache implements ICache {

	private cache = new Map();
	private debug = new Debug('MemoryCache');

	async get<T>(key: string) : Promise<T> {

		try {

			const val = this.cache.get(key);
			if(val) return val as T;

			return val;

		} catch (error) {
			this.debug.error(`Error getting the key "${key}" from cache`, error);
			throw error;
		}

	}

	async set(key: string, value: any, ttl: number) : Promise<void> {
		try {
			this.cache.set(key, value);
			return;
		} catch (error) {
			this.debug.error(`Error setting key "${error}" in the cache`, error);
			throw error;
		}
	}
}