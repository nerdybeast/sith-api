import { Module } from '@nestjs/common';
import { ApexLogController } from './ApexLogController';
import { ApexLogGateway } from './ApexLogGateway';
import { ConnectionModule } from '../../../../components/connection/ConnectionModule';
import { ApexLogFactory } from './ApexLogFactory';

@Module({
	imports: [
		ConnectionModule
	],
	providers: [
		ApexLogGateway,
		ApexLogFactory
	],
	controllers: [
		ApexLogController
	]
})
export class ApexLogModule { }