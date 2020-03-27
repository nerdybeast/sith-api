import Rollbar from 'rollbar';
import { Module, Provider, Global } from '@nestjs/common';
import { ConfigService } from '../components/config/ConfigService';

const rollbarProvider: Provider = {
	provide: 'error-reporter',
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => {

		const logger = new Rollbar({
			accessToken: configService.ROLLBAR_ACCESS_TOKEN,
			captureUncaught: true,
			captureUnhandledRejections: true
		});

		return logger;
	}
};

@Global()
@Module({
	providers: [rollbarProvider],
	exports: [rollbarProvider]
})
export class RollbarModule {

}