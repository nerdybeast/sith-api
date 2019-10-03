import { Module } from '@nestjs/common';
import { TraceFlagController } from './TraceFlagController';
import { TraceFlagGateway } from './TraceFlagGateway';
import { ConnectionModule } from '../../../../components/connection/ConnectionModule';
import { TraceFlagFactory } from './TraceFlagFactory';

@Module({
	imports: [
		ConnectionModule
	],
	controllers: [
		TraceFlagController
	],
	providers: [
		TraceFlagGateway,
		TraceFlagFactory
	]
})
export class TraceFlagModule { }