import { ExceptionFilter, Catch, HttpException, NotFoundException } from '@nestjs/common';
import logger from '../../utilities/logger';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {

	catch(exception: HttpException, response) {

		const status = exception.getStatus();
		const exceptionResponse = exception.getResponse();

		//https://docs.rollbar.com/docs/javascript/#section-server-usage
		logger.warning(exception.message.message, exceptionResponse, response.req);

		response.status(status).json({
			errors: [exceptionResponse]
		});
	}
}
