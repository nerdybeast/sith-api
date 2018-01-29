import { Module } from '@nestjs/common';
import { TraceFlagController } from './trace-flag-controller';

@Module({ 
	controllers: [TraceFlagController]
})
export class TraceFlagModule { }