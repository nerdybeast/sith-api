import { SobjectDescribeBase } from './SobjectDescribeBase';
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