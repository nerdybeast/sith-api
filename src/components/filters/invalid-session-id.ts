import { ExceptionFilter, Catch } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

@Catch(UnauthorizedException)
export class InvalidSessionIdFilter implements ExceptionFilter {

	catch(exception: UnauthorizedException, response) {
		response.status(401).json({
			errors: [exception.getResponse()]
		});
	}
}