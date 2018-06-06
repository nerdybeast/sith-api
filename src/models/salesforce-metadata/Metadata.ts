export class Metadata {
	public fullName: string;

	constructor(json: any = {}) {
		this.fullName = json.fullName || null;
	}
}