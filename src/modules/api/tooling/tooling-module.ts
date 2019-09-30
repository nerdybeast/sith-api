import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ToolingController } from './tooling-controller';
import { ConnectionDetailsMiddleware } from '../../../middleware/ConnectionDetailsMiddleware';
import { ConnectionModule } from '../../../components/connection/ConnectionModule';

@Module({
	imports: [
		ConnectionModule
	],
	controllers: [
		ToolingController
	]
})
export class ToolingModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(ConnectionDetailsMiddleware).forRoutes(
			ToolingController
		);
	}
}