import { JsonApiDocBase } from './json-api-doc-base';

export class OrgVersion extends JsonApiDocBase {

	constructor(data: any = {}) {
		super(data.version);
		this.label = data.label;
		this.url = data.url;
		this.version = data.version;
	}

	//Example: "Winter 18"
	label: string;

	//Example: "/services/data/v41.0"
	url: string;

	//Example: "41.0"
	version: string;
}