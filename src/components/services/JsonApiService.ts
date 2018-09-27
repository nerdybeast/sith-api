import { ResourceObject } from '../../models/JsonApiDocument';

export class JsonApiService {

	public static serialize<T>(type: string, data: any, idProperty: string = 'id') : ResourceObject<T> {

		const dataCopy = Object.assign({}, data);

		const resource = new ResourceObject<T>(dataCopy[idProperty], type);

		if(idProperty === 'id') delete dataCopy[idProperty];

		resource.attributes = dataCopy;
		return resource;
	}

}