import { ICache } from '../../interfaces/ICache';

export class MockCacheService implements ICache {

	private cache: Map<string, any> = new Map<string, any>();

	public async get<T>(key: string) : Promise<T> {
		return this.cache.get(key) as T;
	}

	public async set(key: string, val: any, _ttl: number) : Promise<void> {
		this.cache.set(key, val);
		return;
	}
}