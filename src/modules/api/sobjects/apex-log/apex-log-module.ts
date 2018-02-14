import { Module } from '@nestjs/common';
import { ApexLogController } from './apex-log-controller';
import { ApexLogGateway } from './ApexLogGateway';

@Module({ 
	components: [ApexLogGateway],
	controllers: [ApexLogController]
})
export class ApexLogModule { }