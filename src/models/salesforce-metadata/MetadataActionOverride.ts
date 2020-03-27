import { ActionName } from '../enums/ActionName';
import { FormFactor } from '../enums/FormFactor';
import { ActionOverrideType } from '../enums/ActionOverrideType';
import { toBoolean } from '../../utilities/Cast';

export class MetadataActionOverride {
	public actionName: ActionName;
	public comment: string;
	public content: string;
	public formFactor: FormFactor;
	public skipRecordTypeSelect: boolean;
	public type: ActionOverrideType;

	constructor(rawJson: any = {}) {
		this.actionName = rawJson.actionName || null;
		this.comment = rawJson.comment || null;
		this.content = rawJson.content || null;
		this.formFactor = rawJson.formFactor || null;
		
		//This value is returned as a string from the metadata api.
		this.skipRecordTypeSelect = toBoolean(rawJson.skipRecordTypeSelect);
		
		this.type = rawJson.type || null;
	}
}