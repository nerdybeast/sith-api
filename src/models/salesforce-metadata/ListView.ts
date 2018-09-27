import { Metadata } from './Metadata';
import { FilterScope } from '../enums/FilterScope';
import { ListViewFilter } from './ListViewFilter';
import { SharedTo } from './SharedTo';
import { toArray } from '../../utilities/Cast';

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

	constructor(json: any = {}) {
		super(json);
		this.booleanFilter = json.booleanFilter || null;
		this.columns = toArray(json.columns).map(x => x);
		this.division = json.division || null;
		this.filterScope = json.filterScope || null;
		this.filters = toArray(json.filters).map(x => new ListViewFilter(x));
		this.label = json.label || null;
		this.queue = json.queue || null;
		this.sharedTo = new SharedTo(json.sharedTo);
	}
}