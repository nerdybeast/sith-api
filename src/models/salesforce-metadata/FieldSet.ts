import { FieldSetItem } from './FieldSetItem';
import { toArray } from '../../utilities/Cast';

export class FieldSet {
	public availableFields: FieldSetItem[];
	public description: string;
	public displayedFields: FieldSetItem[];
	public label: string;

	constructor(json: any = {}) {
		this.availableFields = toArray(json.availableFields).map(x => new FieldSetItem(x));
		this.description = json.description || null;
		this.displayedFields = toArray(json.displayedFields).map(x => new FieldSetItem(x));
		this.label = json.label || null;
	}
}