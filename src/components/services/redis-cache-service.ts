import { promisify } from 'util';
import { Component } from '@nestjs/common';
import * as redis from 'redis';
import { ICache } from '../../interfaces/ICache';

// promisify(redis.RedisClient.prototype);
// promisify(redis.Multi.prototype);

// const client = redis.createClient(process.env.REDISCLOUD_URL);

@Component()
export class RedisCache implements ICache {

	async get <T>(key: string) : Promise<T> {

		try {

			// const dataAsString = await promisify(client.get)(key);
			// return JSON.parse(dataAsString) as T;
			return {} as T;

		} catch (error) {
			//log
			throw error;
		}

	}

	async set(key: string, value: any, ttl: number) : Promise<void> {

		// const multi = client.multi().set(key, value);
		// if(ttl) { multi.expire(key, ttl); }

		// const result = await multi.execAsync();

		return;
	}
}