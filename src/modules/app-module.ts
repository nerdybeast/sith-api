import { Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app-controller';
import { UserModule } from './user/user-module';
import { OrgModule } from './org/org-module';
import { ConnectionDetailsMiddleware } from '../middleware/ConnectionDetailsMiddleware';
import { SobjectsModule } from './api/sobjects-module';
import { MetadataModule } from './api/metadata/metadata-module';

@Module({
	modules: [UserModule, OrgModule, SobjectsModule, MetadataModule],
	controllers: [AppController]
})
export class ApplicationModule {}
