import { Module } from '@nestjs/common';
import { DebugLevelController } from './debug-level-controller';

@Module({ 
	controllers: [DebugLevelController]
})
export class DebugLevelModule { }