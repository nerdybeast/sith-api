import { SobjectField } from '../salesforce-metadata/SobjectField';
import { ActionOverride } from '../salesforce-metadata/ActionOverride';
import { MetadataActionOverride } from '../salesforce-metadata/MetadataActionOverride';

export class SobjectDescribeDto {
	public name: string;
	public actionOverrides: ActionOverrideDto[];
	public fields: FieldDto[];
}

export class ActionOverrideDto {
	public sobjectActionOverride: ActionOverride;
	public metadataActionOverride: MetadataActionOverride;
}

export class FieldDto extends SobjectField {
	public description: string;
	public required: boolean;
	public salesforceDataType: string;
	public trackFeedHistory: boolean;
	public trackHistory: boolean;
	public trackTrending: boolean;
}
