import { Module, Provider } from '@nestjs/common';
import redis from 'redis';
import { CacheService } from './CacheService';
import { ConfigService } from '../config/ConfigService';

export const redisClientProvider: Provider = {
	provide: 'redisClient',
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => {

		const client = redis.createClient({
			url: configService.REDIS_URL
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