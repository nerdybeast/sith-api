import { FilterItem } from './FilterItem';
import { toBoolean } from '../../utilities/Cast';
import { isArray } from 'util';

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

		json.filterItems = json.filterItems || [];

		if(!isArray(json.filterItems)) {
			json.filterItems = [json.filterItems];
		}

		this.filterItems = json.filterItems.map(x => new FilterItem(x));
		
		this.infoMessage = json.infoMessage || null;
		this.isOptional = toBoolean(json.isOptional);
	}
}
