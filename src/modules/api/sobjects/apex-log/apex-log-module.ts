import { Module } from '@nestjs/common';
import { ApexLogController } from './apex-log-controller';
import { ApexLogGateway } from './ApexLogGateway';
import { ConnectionModule } from '../../../../components/connection/ConnectionModule';

@Module({
	imports: [
		ConnectionModule
	],
	providers: [
		ApexLogGateway
	],
	controllers: [
		ApexLogController
	]
})
export class ApexLogModule { }