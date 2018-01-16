import { Interceptor, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as jsonapi from 'jsonapi-serializer';
import { IJsonApiDoc } from '../../interfaces/IJsonApiDoc';
import { ConnectionDetails } from '../../models/ConnectionDetails';
import * as mapKeys from 'lodash.mapkeys';
import * as camelCase from 'lodash.camelcase';

@Interceptor()
export class JsonApiInterceptor implements NestInterceptor {
	intercept(dataOrRequest, context: ExecutionContext, stream$: Observable<any>): Observable<any> {

		const acceptsJsonApi = dataOrRequest.headers.accept === 'application/vnd.api+json';

		return stream$.map((response) => {
			return response;
		});
	}
}
