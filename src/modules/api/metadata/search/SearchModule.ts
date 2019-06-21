import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { SearchController } from './SearchController';
import { ConnectionDetailsMiddleware } from '../../../../middleware/ConnectionDetailsMiddleware';

@Module({
	controllers: [SearchController]
})
export class SearchModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(ConnectionDetailsMiddleware).forRoutes(
			SearchController
		);
	}
}