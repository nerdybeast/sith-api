import { Module } from '@nestjs/common';
import { TraceFlagController } from './TraceFlagController';
import { TraceFlagGateway } from './TraceFlagGateway';
import { ConnectionModule } from '../../../../components/connection/ConnectionModule';

@Module({
	imports: [
		ConnectionModule
	],
	controllers: [
		TraceFlagController
	],
	providers: [
		TraceFlagGateway
	]
})
export class TraceFlagModule { }