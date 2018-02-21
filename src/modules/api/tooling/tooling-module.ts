import { Module, NestModule, MiddlewaresConsumer } from '@nestjs/common';
import { ToolingController } from './tooling-controller';
import { ConnectionDetailsMiddleware } from '../../../middleware/ConnectionDetailsMiddleware';

@Module({
	controllers: [ToolingController]
})
export class ToolingModule implements NestModule {
	configure(consumer: MiddlewaresConsumer) {
		consumer.apply(ConnectionDetailsMiddleware).forRoutes(
			ToolingController
		);
	}
}