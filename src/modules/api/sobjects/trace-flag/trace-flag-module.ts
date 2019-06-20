import { Module } from '@nestjs/common';
import { TraceFlagController } from './TraceFlagController';
import { TraceFlagGateway } from './TraceFlagGateway';

@Module({
	controllers: [TraceFlagController],
	providers: [TraceFlagGateway]
})
export class TraceFlagModule { }