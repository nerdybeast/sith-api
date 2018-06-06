import { FilterOperation } from '../enums/FilterOperation';

export class FilterItems {
	public field: string;
	public operation: FilterOperation;
	public value: string;

	constructor(json: any = {}) {
		this.field = json.field || null;
		this.operation = json.operation || null;
		this.value = json.value || null;
	}
}