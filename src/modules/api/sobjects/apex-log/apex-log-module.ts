import { Module } from '@nestjs/common';
import { ApexLogController } from './apex-log-controller';

@Module({ 
	controllers: [ApexLogController]
})
export class ApexLogModule { }