import { IJsonApiDoc } from '../interfaces/IJsonApiDoc';

export class JsonApiDocBase implements IJsonApiDoc {

	constructor(id?: string) {
		this.id = id;
	}

	id: string;
}