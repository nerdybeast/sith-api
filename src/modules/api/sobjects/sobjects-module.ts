import { Module } from '@nestjs/common';
import { NestModule, MiddlewaresConsumer } from '@nestjs/common/interfaces';
import { ConnectionDetailsMiddleware } from '../../../middleware/ConnectionDetailsMiddleware';
import { TraceFlagModule } from '../sobjects/trace-flag/trace-flag-module';
import { TraceFlagController } from '../sobjects/trace-flag/trace-flag-controller';
import { ApexLogModule } from '../sobjects/apex-log/apex-log-module';
import { ApexLogController } from '../sobjects/apex-log/apex-log-controller';
import { DebugLevelModule } from '../sobjects/debug-level/debug-level-module';
import { DebugLevelController } from '../sobjects/debug-level/debug-level-controller';

@Module({
	modules: [ TraceFlagModule, ApexLogModule, DebugLevelModule ]
})
export class SobjectsModule implements NestModule {
	configure(consumer: MiddlewaresConsumer) {
		consumer.apply(ConnectionDetailsMiddleware).forRoutes(
			TraceFlagController,
			ApexLogController,
			DebugLevelController
		);
	}
}