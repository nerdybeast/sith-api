import { Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app-controller';
import { UserModule } from './user/user-module';
import { OrgModule } from './org/org-module';
import { ConnectionDetailsMiddleware } from '../middleware/ConnectionDetailsMiddleware';
import { SobjectsModule } from './api/sobjects-module';
import { MetadataModule } from './api/metadata/metadata-module';
import { ToolingModule } from './api/tooling/tooling-module';

@Module({
	modules: [UserModule, OrgModule, SobjectsModule, MetadataModule, ToolingModule],
	controllers: [AppController]
})
export class ApplicationModule {}
