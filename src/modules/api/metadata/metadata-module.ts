import { Module } from '@nestjs/common';
import { LogTypeModule } from './log-type-module';

@Module({
	modules: [LogTypeModule]
})
export class MetadataModule { }