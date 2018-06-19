import { FilterOperation } from '../enums/FilterOperation';

export class ListViewFilter {
	
	//SF docs say this property is called "filter" but their api returns "field".
	public filter: string;
	public field: string;

	public operation: FilterOperation;
	public value: string;
	
	constructor(json: any = {}) {
		this.filter = json.filter || null;
		this.field = json.field || null;
		this.operation = json.operation || null;
		this.value = json.value || null;
	}
}