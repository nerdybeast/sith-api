// import { FilterItems } from './FilterItems';

// export class FilterItem extends FilterItems {
// 	public valueField: string;

// 	constructor(json: any = {}) {
// 		super(json);
// 		this.valueField = json.valueField || null;
// 	}
// }

import { FilterOperation } from '../enums/FilterOperation';

export class FilterItem {
	public field: string;
	public operation: FilterOperation;
	public value: string;
	public valueField: string;

	constructor(json: any = {}) {
		this.field = json.field || null;
		this.operation = json.operation || null;
		this.value = json.value || null;
		this.valueField = json.valueField || null;
	}
}