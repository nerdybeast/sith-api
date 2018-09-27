import { PicklistValue } from './PicklistValue';
import { toArray } from '../../utilities/Cast';

export class RecordTypePicklistValue {
	
	/**
	 * This will be the field name for which these picklist values belong to.
	 */
	public picklist: string;

	public values: PicklistValue[];

	constructor(json: any = {}) {
		this.picklist = json.picklist || null;
		this.values = toArray(json.values).map(x => new PicklistValue(x));
	}
}