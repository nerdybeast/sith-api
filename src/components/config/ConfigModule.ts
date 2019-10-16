import { Module, Provider, Global } from '@nestjs/common';
import { ConfigService } from './ConfigService';

export const envVarsProvider: Provider = {
	provide: 'environment-variables',
	useValue: process.env
};

/**
 * Making this module Global because it may be used throughout all the app so it makes sense to only have to register it once.
 */
@Global()
@Module({
	providers: [
		ConfigService,
		envVarsProvider
	],
	exports: [
		ConfigService
	]
})
export class ConfigModule {

}