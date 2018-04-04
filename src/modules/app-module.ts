import { Module } from '@nestjs/common';
import { AppController } from './app-controller';
import { UserModule } from './user/user-module';
import { OrgModule } from './org/org-module';
import { ApiModule } from './api/api-module';

@Module({
	modules: [UserModule, OrgModule, ApiModule],
	controllers: [AppController]
})
export class ApplicationModule {}
