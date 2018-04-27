import { ExceptionFilter, Catch, HttpException } from '@nestjs/common';
import logger from '../../utilities/logger';

@Catch(HttpException)
export class GlobalHttpExceptionFilter implements ExceptionFilter {

	catch(exception: HttpException, response) {

		const status = exception.getStatus();
		const exceptionResponse = exception.getResponse();

		logger.error({
			message: exception.message,
			err: exceptionResponse,
			request: response.req
		});

		response.status(status).json({
			errors: [exceptionResponse]
		});
	}
}
