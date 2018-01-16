import { PicklistValue } from './picklist-value';

export class SobjectField {
	aggregatable: boolean;
	autoNumber: boolean;
	byteLength: number;
	calculated: boolean;

	/**
	 * If set will be a formula field expression.
	 */
	calculatedFormula: string;

	cascadeDelete: boolean;
	caseSensitive: boolean;
	controllerName: any;
	createable: boolean;
	custom: boolean;
	defaultValue: any;
	defaultValueFormula: string;
	defaultedOnCreate: boolean;
	dependentPicklist: boolean;
	deprecatedAndHidden: boolean;
	digits: number;
	displayLocationInDecimal: boolean;
	encrypted: boolean;
	externalId: boolean;
	extraTypeInfo: any;
	filterable: boolean;
	filteredLookupInfo: any;
	groupable: boolean;
	highScaleNumber: boolean;
	htmlFormatted: boolean;
	idLookup: boolean;
	inlineHelpText: string;
	label: string;
	length: number;
	mask: string;
	maskType: string;
	name: string;
	nameField: boolean;
	namePointing: boolean;
	nillable: boolean;
	permissionable: boolean;
	picklistValues: PicklistValue[];
	precision: number;
	queryByDistance: boolean;
	referenceTargetField: any;
	referenceTo: string[];
	relationshipName: string;
	relationshipOrder: any;
	restrictedDelete: boolean;
	restrictedPicklist: boolean;
	scale: number;
	soapType: string;
	sortable: boolean;
	type: string;
	unique: boolean;
	updateable: boolean;
	writeRequiresMasterRead: boolean;
}