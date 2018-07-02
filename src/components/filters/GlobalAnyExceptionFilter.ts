import { ExceptionFilter, Catch } from '@nestjs/common';
import logger from '../../utilities/logger';

/**
 * This exception filter will catch any exception thrown in the app if not already caught by another exception filter.
 */
@Catch()
export class GlobalAnyExceptionFilter implements ExceptionFilter {

	catch(exception: Error, response) {

		logger.critical(exception.message, exception, response.req);

		response.status(500).json({
			errors: [exception]
		});
	}
}
