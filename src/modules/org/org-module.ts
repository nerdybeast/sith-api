import { Module } from '@nestjs/common';
import { OrgController } from './org-controller';
import { OrgService } from './org-service';
import { GotModule } from '../../third-party-modules/GotModule';

@Module({
	imports: [GotModule],
	controllers: [OrgController],
	providers: [OrgService]
})
export class OrgModule {}