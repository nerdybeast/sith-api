import { NestFactory } from '@nestjs/core';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { ApplicationModule } from './modules/app-module';
import { ConfigService } from './components/config/ConfigService';
import { Logger } from '@nestjs/common';
import { DebugFactory } from './third-party-modules/debug/DebugFactory';

(async function bootstrap() {

	const app = await NestFactory.create(ApplicationModule);
	const configService = app.get(ConfigService);
	const debugFactory = app.get(DebugFactory);
	const debugService = debugFactory.create(__filename);

	app.use(morgan('dev'));
	app.use(cors());

	//Tell the json body parser to parse all request bodies that contain a Content-Type matching this expression.
	app.use(bodyParser.json({ type: ['application/json', 'application/vnd.api+json'] }));

	const logger = new Logger('Bootstrap');
	await app.listen(configService.PORT, () => logger.log(`Api is running on port ${configService.PORT}...`));

	debugService.info('main process id', process.pid);
})();
