import { Module } from '@nestjs/common';
import { TraceFlagController } from './TraceFlagController';
import { TraceFlagGateway } from './TraceFlagGateway';

@Module({
	components: [TraceFlagGateway],
	controllers: [TraceFlagController]
})
export class TraceFlagModule { }