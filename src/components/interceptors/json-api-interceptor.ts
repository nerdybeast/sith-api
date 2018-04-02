import { Interceptor, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Interceptor()
export class JsonApiInterceptor implements NestInterceptor {
	intercept(dataOrRequest, context: ExecutionContext, stream$: Observable<any>): Observable<any> {

		// const acceptsJsonApi = dataOrRequest.headers.accept === 'application/vnd.api+json';

		return stream$.map((response) => {
			return response;
		});
	}
}
