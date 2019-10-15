import { Module, Provider } from '@nestjs/common';
import redis from 'redis';
import { CacheService } from './CacheService';
// import { promisify } from 'util';

// promisify(redis.RedisClient);
// promisify(redis.Multi);

export const redisClientProvider: Provider = {
	provide: 'redisClient',
	useFactory: () => {

		const client = redis.createClient({
			url: process.env.REDIS_URL
		});

		client.on('ready', () => console.log('Redis ready event...'));
		client.on('error', (err) => console.error('Redis error:', err));

		return client;
	}
};

@Module({
	providers: [
		redisClientProvider,
		CacheService
	],
	exports: [
		CacheService
	]
})
export class CacheModule {

}