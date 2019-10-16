import { ConfigService } from '../components/config/ConfigService';
import { IEnvironmentVariables } from '../components/config/IEnvironmentVariables';
import { Provider } from '@nestjs/common';

export function createConfigService(environmentVariables?: IEnvironmentVariables) : ConfigService {

	const defaultConfigValues = {
		REDIS_URL: 'asdf',
		AUTH0_API_CLIENT_ID: 'asdf',
		AUTH0_API_CLIENT_SECRET: 'asdf',
		TRACE_FLAG_POLLING_RATE: '5000',
		APEX_LOG_POLLING_RATE: '5000',
		PORT: '5000',
		ROLLBAR_ACCESS_TOKEN: 'asdf',
	};

	const envVars = Object.assign(defaultConfigValues, environmentVariables);
	return new ConfigService(envVars);
}

export function createConfigServiceProvider(environmentVariables?: IEnvironmentVariables) : Provider {

	const configService = createConfigService(environmentVariables);

	return {
		provide: ConfigService,
		useValue: configService
	};
}