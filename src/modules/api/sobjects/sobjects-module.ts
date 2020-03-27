import { Module } from '@nestjs/common';
import { NestModule, MiddlewareConsumer } from '@nestjs/common/interfaces';
import { ConnectionDetailsMiddleware } from '../../../middleware/ConnectionDetailsMiddleware';
import { TraceFlagModule } from '../sobjects/trace-flag/TraceFlagModule';
import { TraceFlagController } from '../sobjects/trace-flag/TraceFlagController';
import { ApexLogModule } from '../sobjects/apex-log/ApexLogModule';
import { ApexLogController } from '../sobjects/apex-log/ApexLogController';
import { DebugLevelModule } from '../sobjects/debug-level/debug-level-module';
import { DebugLevelController } from '../sobjects/debug-level/debug-level-controller';

@Module({
	imports: [ TraceFlagModule, ApexLogModule, DebugLevelModule ]
})
export class SobjectsModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(ConnectionDetailsMiddleware).forRoutes(
			TraceFlagController,
			ApexLogController,
			DebugLevelController
		);
	}
}