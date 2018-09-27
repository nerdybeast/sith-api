export class IndexField {
	public name: string;
	public sortDirection: string;
	constructor(json: any = {}) {
		this.name = json.name || null;
		this.sortDirection = json.sortDirection || null;
	}
}