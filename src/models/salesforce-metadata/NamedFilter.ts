import { Metadata } from './Metadata';
import { FilterItems } from './FilterItems';
import { toBoolean, toArray } from '../../utilities/Cast';

export class NamedFilter extends Metadata {
	public active: boolean;
	public booleanFilter: string;
	public description: string;
	public errorMessage: string;
	public field: string;
	public filterItems: FilterItems[];
	public infoMessage: string;
	public isOptional: boolean;
	public name: string;
	public sourceObject: string;

	constructor(json: any = {}) {

		super(json);

		this.active = toBoolean(json.active);
		this.booleanFilter = json.booleanFilter || null;
		this.description = json.description || null;
		this.errorMessage = json.errorMessage || null;
		this.field = json.field || null;
		this.filterItems = toArray(json.filterItems).map(x => new FilterItems(x));
		this.infoMessage = json.infoMessage || null;
		this.isOptional = toBoolean(json.isOptional);
		this.name = json.name || null;
		this.sourceObject = json.sourceObject || null;
	}
}