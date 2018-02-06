import { NestFactory } from '@nestjs/core';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import { ApplicationModule } from './modules/app-module';
import { JsonApiInterceptor } from './components/interceptors/json-api-interceptor';
import { InvalidSessionIdFilter } from './components/filters/invalid-session-id';
import { Debug } from './utilities/debug';

(async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule);
	app.useGlobalInterceptors(new JsonApiInterceptor());
	app.useGlobalFilters(new InvalidSessionIdFilter());
	app.use(morgan('dev'));
	app.use(cors());
	
	//Tell the json body parser to parse all request bodies that contain a Content-Type matching this expression.
	app.use(bodyParser.json({ type: ['application/json', 'application/vnd.api+json'] }));

	const port = Number(process.env.PORT) || 5000;
	await app.listen(port, () => console.log(`\nApi is running on port ${port}...\n`));

	const debug = new Debug('server');
	debug.verbose('main process id', process.pid);
})();
