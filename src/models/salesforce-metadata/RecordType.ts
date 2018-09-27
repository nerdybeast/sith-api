import { Metadata } from './Metadata';
import { RecordTypePicklistValue } from './RecordTypePicklistValue';
import { toBoolean, toArray } from '../../utilities/Cast';

export class RecordType extends Metadata {
	public active: boolean;
	public businessProcess: string;
	public compactLayoutAssignment: string;
	public description: string;
	public label: string;
	public picklistValues: RecordTypePicklistValue[];

	constructor(json: any = {}) {
		super(json);
		this.active = toBoolean(json.active);
		this.businessProcess = json.businessProcess || null;
		this.compactLayoutAssignment = json.compactLayoutAssignment || null;
		this.description = json.description || null;
		this.label = json.label || null;
		this.picklistValues = toArray(json.picklistValues).map(x => new RecordTypePicklistValue(x));
	}
}