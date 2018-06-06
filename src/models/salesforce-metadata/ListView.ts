import { Metadata } from './Metadata';
import { FilterScope } from '../enums/FilterScope';
import { ListViewFilter } from './ListViewFilter';
import { SharedTo } from './SharedTo';

export class ListView extends Metadata {
	public booleanFilter: string;
	public columns: string[];
	public division: string;
	public filterScope: FilterScope;
	public filters: ListViewFilter[];
	public label: string;
	//public language: Language;
	public queue: string;
	public sharedTo: SharedTo;
}