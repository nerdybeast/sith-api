import { NestFactory } from '@nestjs/core';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { ApplicationModule } from './modules/app-module';
import { Debug } from './utilities/debug';
import { GlobalHttpExceptionFilter } from './components/filters/GlobalHttpExceptionFilter';
import { GlobalAnyExceptionFilter } from './components/filters/GlobalAnyExceptionFilter';
import { NotFoundExceptionFilter } from './components/filters/NotFoundExceptionFilter';

(async function bootstrap() {

	const app = await NestFactory.create(ApplicationModule);

	app.useGlobalFilters(new NotFoundExceptionFilter(), new GlobalHttpExceptionFilter(), new GlobalAnyExceptionFilter());
	app.use(morgan('dev'));
	app.use(cors());

	//Tell the json body parser to parse all request bodies that contain a Content-Type matching this expression.
	app.use(bodyParser.json({ type: ['application/json', 'application/vnd.api+json'] }));

	const port = Number(process.env.PORT) || 5000;
	await app.listen(port, () => console.log(`\nApi is running on port ${port}...\n`));

	const debug = new Debug('server');
	debug.info('main process id', process.pid);
})();
