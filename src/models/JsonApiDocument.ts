export class JsonApiDocument<T> {
	constructor(public data: ResourceObject<T> | ResourceObject<T>[]) {}
}

export class ResourceObject<T> {
	
	constructor(id: string, type: string) {
		this.id = id;
		this.type = type;
	}
	
	public id: string;
	public type: string;
	public attributes: any;
}