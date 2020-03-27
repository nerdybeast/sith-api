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

		return new Promise((resolve, reject) => {

			this.redisClient.get(key, (err, reply) => {

				if(err) {
					return reject(err);
				}

				return resolve(JSON.parse(reply));
			});

		});
	}

	public async set(key: string, val: any, ttlInSeconds: number = 1200) : Promise<void> {

		return new Promise((resolve, reject) => {

			this.redisClient.set(key, JSON.stringify(val), 'EX', ttlInSeconds, (err, _reply) => {

				if(err) {
					return reject(err);
				}
	
				return resolve();
			});

		});
	}
}