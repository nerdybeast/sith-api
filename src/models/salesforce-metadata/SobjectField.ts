import { PicklistValue } from './PicklistValue';
import { FilteredLookupInfo } from './FilteredLookupInfo';

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
	filteredLookupInfo: FilteredLookupInfo;
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

	constructor(sobjectField: any = {}) {
		this.aggregatable = sobjectField.aggregatable;
		this.autoNumber = sobjectField.autoNumber;
		this.byteLength = sobjectField.byteLength;
		this.calculated = sobjectField.calculated;
		this.calculatedFormula = sobjectField.calculatedFormula;
		this.cascadeDelete = sobjectField.cascadeDelete;
		this.caseSensitive = sobjectField.caseSensitive;
		this.controllerName = sobjectField.controllerName;
		this.createable = sobjectField.createable;
		this.custom = sobjectField.custom;
		this.defaultValue = sobjectField.defaultValue;
		this.defaultValueFormula = sobjectField.defaultValueFormula;
		this.defaultedOnCreate = sobjectField.defaultedOnCreate;
		this.dependentPicklist = sobjectField.dependentPicklist;
		this.deprecatedAndHidden = sobjectField.deprecatedAndHidden;
		this.digits = sobjectField.digits;
		this.displayLocationInDecimal = sobjectField.displayLocationInDecimal;
		this.encrypted = sobjectField.encrypted;
		this.externalId = sobjectField.externalId;
		this.extraTypeInfo = sobjectField.extraTypeInfo;
		this.filterable = sobjectField.filterable;
		this.filteredLookupInfo = sobjectField.filteredLookupInfo;
		this.groupable = sobjectField.groupable;
		this.highScaleNumber = sobjectField.highScaleNumber;
		this.htmlFormatted = sobjectField.htmlFormatted;
		this.idLookup = sobjectField.idLookup;
		this.inlineHelpText = sobjectField.inlineHelpText;
		this.label = sobjectField.label;
		this.length = sobjectField.length;
		this.mask = sobjectField.mask;
		this.maskType = sobjectField.maskType;
		this.name = sobjectField.name;
		this.nameField = sobjectField.nameField;
		this.namePointing = sobjectField.namePointing;
		this.nillable = sobjectField.nillable;
		this.permissionable = sobjectField.permissionable;
		this.picklistValues = sobjectField.picklistValues;
		this.precision = sobjectField.precision;
		this.queryByDistance = sobjectField.queryByDistance;
		this.referenceTargetField = sobjectField.referenceTargetField;
		this.referenceTo = sobjectField.referenceTo;
		this.relationshipName = sobjectField.relationshipName;
		this.relationshipOrder = sobjectField.relationshipOrder;
		this.restrictedDelete = sobjectField.restrictedDelete;
		this.restrictedPicklist = sobjectField.restrictedPicklist;
		this.scale = sobjectField.scale;
		this.soapType = sobjectField.soapType;
		this.sortable = sobjectField.sortable;
		this.type = sobjectField.type;
		this.unique = sobjectField.unique;
		this.updateable = sobjectField.updateable;
		this.writeRequiresMasterRead = sobjectField.writeRequiresMasterRead;
	}
}