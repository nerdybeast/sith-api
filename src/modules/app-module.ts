import { Module, NestModule } from '@nestjs/common';
import { AppController } from './app-controller';
import { UserModule } from './user/user-module';
import { OrgModule } from './org/org-module';
import { SalesforceModule } from './salesforce/salesforce-module';

@Module({
	modules: [UserModule, OrgModule, SalesforceModule],
	controllers: [AppController]
})
export class ApplicationModule {}
