import { SobjectDescribeBase, fieldNames as baseSobjectFieldnames } from './SobjectDescribeBase';
import { ActionOverride } from './ActionOverride';
import { ChildRelationship } from './ChildRelationship';
import { SobjectField } from './SobjectField';
import { NamedLayoutInfo } from './NamedLayoutInfo';
import { RecordTypeInfo } from './RecordTypeInfo';

export class SobjectDescribe extends SobjectDescribeBase {
	actionOverrides: ActionOverride[];
	childRelationships: ChildRelationship[];
	compactLayoutable: boolean;
	fields: SobjectField[];
	listviewable: any;
	lookupLayoutable: any;
	namedLayoutInfos: NamedLayoutInfo[];
	recordTypeInfos: RecordTypeInfo[];
	searchLayoutable: boolean;
}

export const fieldNames: string[] = [
	...baseSobjectFieldnames,
	'actionOverrides',
	'childRelationships',
	'compactLayoutable',
	'fields',
	'listviewable',
	'lookupLayoutable',
	'namedLayoutInfos',
	'recordTypeInfos',
	'searchLayoutable'
];