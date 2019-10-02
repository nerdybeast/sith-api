import { ExceptionFilter, Catch, HttpException } from '@nestjs/common';
import logger from '../../utilities/logger';

@Catch(HttpException)
export class GlobalHttpExceptionFilter implements ExceptionFilter {

	catch(exception: HttpException, response: any) {

		const status = exception.getStatus();
		const exceptionResponse = exception.getResponse();

		//https://docs.rollbar.com/docs/javascript/#section-server-usage
		logger.error(exception.message.message, exceptionResponse, response.req);

		response.status(status).json({
			errors: [exceptionResponse]
		});
	}
}
