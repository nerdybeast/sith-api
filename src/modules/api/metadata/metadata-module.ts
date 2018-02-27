import { Module, NestModule, MiddlewaresConsumer } from '@nestjs/common';
import { LogTypeModule } from './log-type-module';
import { DescribeModule, DescribeController } from './describe-module';
import { ConnectionDetailsMiddleware } from '../../../middleware/ConnectionDetailsMiddleware';

@Module({
	modules: [LogTypeModule, DescribeModule]
})
export class MetadataModule implements NestModule {
	configure(consumer: MiddlewaresConsumer) {
		consumer.apply(ConnectionDetailsMiddleware).forRoutes(
			DescribeController
		);
	}
}