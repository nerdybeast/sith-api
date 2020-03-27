import { ExceptionFilter, Catch, HttpException, NotFoundException, Inject, Provider } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import Rollbar from 'rollbar';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {

	private errorReporter: Rollbar;

	constructor(@Inject('error-reporter') errorReporter: Rollbar) {
		this.errorReporter = errorReporter;
	}

	catch(exception: HttpException, response) {

		const status = exception.getStatus();
		const exceptionResponse = exception.getResponse();

		//https://docs.rollbar.com/docs/javascript/#section-server-usage
		this.errorReporter.warning(exception.message.message, exceptionResponse, response.req);

		response.status(status).json({
			errors: [exceptionResponse]
		});
	}
}

export const NotFoundExceptionFilterProvider: Provider = {
	provide: APP_FILTER,
	useClass: NotFoundExceptionFilter
};
