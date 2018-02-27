import { Urls } from '../urls';

export class SobjectDescribeBase {
	activateable: boolean;
	createable: boolean;
	custom: boolean;
	customSetting: boolean;
	deletable: boolean;
	deprecatedAndHidden: boolean;
	feedEnabled: boolean;
	hasSubtypes: boolean;
	isSubtype: boolean;
	keyPrefix: string;
	label: string;
	labelPlural: string;
	layoutable: boolean;
	mergeable: boolean;
	mruEnabled: boolean;
	name: string;
	queryable: boolean;
	replicateable: boolean;
	retrieveable: boolean;
	searchable: boolean;
	triggerable: boolean;
	undeletable: boolean;
	updateable: boolean;
	urls: Urls;
	isTooling: boolean;
}

export const fieldNames: string[] = [
	'activateable',
	'createable',
	'custom',
	'customSetting',
	'deletable',
	'deprecatedAndHidden',
	'feedEnabled',
	'hasSubtypes',
	'isSubtype',
	'keyPrefix',
	'label',
	'labelPlural',
	'layoutable',
	'mergeable',
	'mruEnabled',
	'name',
	'queryable',
	'replicateable',
	'retrieveable',
	'searchable',
	'triggerable',
	'undeletable',
	'updateable',
	'urls',
	'isTooling'
];
