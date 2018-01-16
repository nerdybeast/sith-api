import { Component } from '@nestjs/common';
import { ICache } from '../../interfaces/ICache';

@Component()
export class MemoryCache implements ICache {

	private cache = new Map();

	async get<T>(key: string) : Promise<T> {

		try {

			const val = this.cache.get(key);
			if(val) return val as T;

			return val;

		} catch (error) {
			//log
			throw error;
		}

	}

	async set(key: string, value: any, ttl: number) : Promise<void> {
		this.cache.set(key, value);
		return;
	}
}