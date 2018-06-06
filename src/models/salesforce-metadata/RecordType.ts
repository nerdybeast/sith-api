import { Metadata } from './Metadata';
import { RecordTypePicklistValue } from './RecordTypePicklistValue';

export class RecordType extends Metadata {
	public active: boolean;
	public businessProcess: string;
	public compactLayoutAssignment: string;
	public description: string;
	public label: string;
	public picklistValues: RecordTypePicklistValue[];
}