export class JsonApiDocument<T> {
	constructor(public data: ResourceObject<T> | ResourceObject<T>[]) {}
}

//@ts-ignore - Need to figure out what to do with "T" here
export class ResourceObject<T> {
	
	constructor(id: string, type: string) {
		this.id = id;
		this.type = type;
	}
	
	public id: string;
	public type: string;
	public attributes: any;
}