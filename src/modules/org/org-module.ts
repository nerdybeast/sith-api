import { Module } from '@nestjs/common';
import { OrgController } from './org-controller';
import { OrgService } from './org-service';

@Module({
	controllers: [OrgController],
	components: [OrgService]
})
export class OrgModule {}