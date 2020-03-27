import { Module } from '@nestjs/common';
import { DebugLevelController } from './debug-level-controller';
import { ConnectionModule } from '../../../../components/connection/ConnectionModule';

@Module({
	imports: [
		ConnectionModule
	],
	controllers: [
		DebugLevelController
	]
})
export class DebugLevelModule { }