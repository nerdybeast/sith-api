import { Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app-controller';
import { UserModule } from './user/user-module';
import { OrgModule } from './org/org-module';
import { ConnectionDetailsMiddleware } from '../middleware/ConnectionDetailsMiddleware';
import { SobjectsModule } from './api/sobjects-module';

@Module({
	modules: [UserModule, OrgModule, SobjectsModule],
	controllers: [AppController]
})
export class ApplicationModule {}
