import Rollbar from 'rollbar';
import { ExceptionFilter, Catch, Inject, Provider } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

/**
 * This exception filter will catch any exception thrown in the app if not already caught by another exception filter.
 */
@Catch()
export class GlobalAnyExceptionFilter implements ExceptionFilter {

	private errorReporter: Rollbar;

	constructor(@Inject('error-reporter') errorReporter: Rollbar) {
		this.errorReporter = errorReporter;
	}

	catch(exception: Error, response) {

		this.errorReporter.critical(exception.message, exception, response.req);

		response.status(500).json({
			errors: [exception]
		});
	}
}

export const GlobalAnyExceptionFilterProvider: Provider = {
	provide: APP_FILTER,
	useClass: GlobalAnyExceptionFilter
};
