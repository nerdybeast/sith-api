import { FilterItem } from './FilterItem';
import { toBoolean, toArray } from '../../utilities/Cast';

export class LookupFilter {
	public active: boolean;
	public booleanFilter: string;
	public description: string;
	public errorMessage: string;
	public filterItems: FilterItem[];
	public infoMessage: string;
	public isOptional: boolean;

	constructor(json: any = {}) {
		this.active = toBoolean(json.active);
		this.booleanFilter = json.booleanFilter || null;
		this.description = json.description || null;
		this.errorMessage = json.errorMessage || null;
		this.filterItems = toArray(json.filterItems).map(x => new FilterItem(x));
		this.infoMessage = json.infoMessage || null;
		this.isOptional = toBoolean(json.isOptional);
	}
}
