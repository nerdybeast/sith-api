import { toBoolean } from '../../utilities/Cast';

export class FieldSetItem {
	public field: string;
	public isFieldManaged: boolean;
	public isRequired: boolean;

	constructor(json: any = {}) {
		this.field = json.field || null;
		this.isFieldManaged = toBoolean(json.isFieldManaged);
		this.isRequired = toBoolean(json.isRequired);
	}
}