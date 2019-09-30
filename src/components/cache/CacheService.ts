import { Injectable, Inject } from '@nestjs/common';
import { RedisClient } from 'redis';
import { ICache } from '../../interfaces/ICache';

@Injectable()
export class CacheService implements ICache {

	private redisClient: RedisClient;

	constructor(@Inject('redisClient') redisClient: RedisClient) {
		this.redisClient = redisClient;
	}

	public async get<T>(key: string) : Promise<T> {

		//@ts-ignore - We called util.promisify on the redis prototype which at run time adds an "async" version
		//of all the redis client methods that Typescript doesn't know about so we need to ignore the error here
		//stating "getAsync" can't be found on our redis instance.
		const val = await this.redisClient.getAsync(key);

		return JSON.parse(val) as T;
	}

	public async set(key: string, val: any, ttlInSeconds: number = 1200) : Promise<void> {

		//@ts-ignore - We called util.promisify on the redis prototype which at run time adds an "async" version
		//of all the redis client methods that Typescript doesn't know about so we need to ignore the error here
		//stating "setAsync" can't be found on our redis instance.
		await this.redisClient.setAsync(key, JSON.stringify(val), 'EX', ttlInSeconds);
	}
}