export class ChildRelationship {
	cascadeDelete: boolean;
	
	//Example: 'Account', 'Custom_Object__c', etc...
	childSObject: string;

	deprecatedAndHidden: boolean;

	//The field name for this child sobject, example: 'RecordId', 'My_Custom_Field__c', etc...
	field: string;

	junctionIdListNames: any[];
	junctionReferenceTo: any[];

	//The value that is needed to reference this child sobject and its properties, example:
	//'Account', 'Custom_Object__r', etc...
	relationshipName: string;

	restrictedDelete: boolean;
}