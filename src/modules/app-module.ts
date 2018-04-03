import { Module } from '@nestjs/common';
import { AppController } from './app-controller';
import { UserModule } from './user/user-module';
import { OrgModule } from './org/org-module';
import { SobjectsModule } from './api/sobjects-module';
import { MetadataModule } from './api/metadata/metadata-module';
import { ToolingModule } from './api/tooling/tooling-module';

@Module({
	modules: [UserModule, OrgModule, ApiModule],
	controllers: [AppController]
})
export class ApplicationModule {}
