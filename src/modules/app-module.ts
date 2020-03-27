import { Module } from '@nestjs/common';
import { AppController } from './app-controller';
import { UserModule } from './user/user-module';
import { OrgModule } from './org/org-module';
import { ApiModule } from './api/api-module';
import { ConfigModule } from '../components/config/ConfigModule';
import { GlobalAnyExceptionFilterProvider } from '../components/filters/GlobalAnyExceptionFilter';
import { GlobalHttpExceptionFilterProvider } from '../components/filters/GlobalHttpExceptionFilter';
import { NotFoundExceptionFilterProvider } from '../components/filters/NotFoundExceptionFilter';
import { RollbarModule } from '../third-party-modules/RollbarModule';
import { DebugModule } from '../third-party-modules/debug/DebugModule';

@Module({
	imports: [
		ConfigModule, //Global module, only needs to be imported here
		RollbarModule, //Global module, only needs to be imported here
		DebugModule, //Global module, only needs to be imported here
		UserModule,
		OrgModule,
		ApiModule
	],
	providers: [
		//These filter providers are being registered here which will make them global and allow dependency injection.
		//NOTE: Using the useGlobalFilters() function on the nest container does not setup dependency injection.
		GlobalAnyExceptionFilterProvider,
		GlobalHttpExceptionFilterProvider,
		NotFoundExceptionFilterProvider
	],
	controllers: [
		AppController
	]
})
export class ApplicationModule {}
