import { Module } from '@nestjs/common';
import { ApexLogController } from './apex-log-controller';
import { ApexLogGateway } from './ApexLogGateway';

@Module({ 
	providers: [ApexLogGateway],
	controllers: [ApexLogController]
})
export class ApexLogModule { }