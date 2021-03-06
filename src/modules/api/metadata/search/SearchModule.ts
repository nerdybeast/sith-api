import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { SearchController } from './SearchController';
import { ConnectionDetailsMiddleware } from '../../../../middleware/ConnectionDetailsMiddleware';
import { ConnectionModule } from '../../../../components/connection/ConnectionModule';

@Module({
	imports: [
		ConnectionModule
	],
	controllers: [
		SearchController
	]
})
export class SearchModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(ConnectionDetailsMiddleware).forRoutes(
			SearchController
		);
	}
}