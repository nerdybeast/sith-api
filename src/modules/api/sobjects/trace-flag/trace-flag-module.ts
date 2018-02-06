import { Module } from '@nestjs/common';
import { TraceFlagController } from './trace-flag-controller';
import { TraceFlagGateway } from './TraceFlagGateway';

@Module({
	components: [TraceFlagGateway],
	controllers: [TraceFlagController]
})
export class TraceFlagModule { }