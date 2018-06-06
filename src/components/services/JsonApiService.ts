import { ResourceObject } from '../../models/JsonApiDocument';

export class JsonApiService {

	serialize<T>(type: string, data: any, idProperty: string = 'id') : ResourceObject<T> {

		const resource = new ResourceObject<T>(data[idProperty], type);

		delete data[idProperty];

		resource.attributes = data;
		return resource;
	}

}