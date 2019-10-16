import { ExceptionFilter, Catch, HttpException, Inject, Provider } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import Rollbar from 'rollbar';

@Catch(HttpException)
export class GlobalHttpExceptionFilter implements ExceptionFilter {

	private errorReporter: Rollbar;

	constructor(@Inject('error-reporter') errorReporter: Rollbar) {
		this.errorReporter = errorReporter;
	}

	catch(exception: HttpException, response: any) {

		const status = exception.getStatus();
		const exceptionResponse = exception.getResponse();

		//https://docs.rollbar.com/docs/javascript/#section-server-usage
		this.errorReporter.error(exception.message.message, exceptionResponse, response.req);

		response.status(status).json({
			errors: [exceptionResponse]
		});
	}
}

export const GlobalHttpExceptionFilterProvider: Provider = {
	provide: APP_FILTER,
	useClass: GlobalHttpExceptionFilter
};
