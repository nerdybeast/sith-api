import { ExceptionFilter, Catch, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {

	catch(exception: HttpException, response) {

		const status = exception.getStatus();
		const exceptionResponse = exception.getResponse();

		response.status(status).json({
			errors: [exceptionResponse]
		});
	}
}