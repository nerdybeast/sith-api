import { Module, Provider, Logger } from '@nestjs/common';
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

		const logger = new Logger('Redis');

		client.on('ready', () => logger.log('ready'));
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