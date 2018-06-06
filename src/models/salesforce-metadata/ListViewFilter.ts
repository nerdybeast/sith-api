import { FilterOperation } from '../enums/FilterOperation';

export class ListViewFilter {
	public filter: string;
	public operation: FilterOperation;
	public value: string;
}