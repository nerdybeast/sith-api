import { SobjectField } from '../salesforce-metadata/SobjectField';
import { ActionOverride } from '../salesforce-metadata/ActionOverride';
import { MetadataActionOverride } from '../salesforce-metadata/MetadataActionOverride';
import { CustomField } from '../salesforce-metadata/CustomField';

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

	/**
	 * Metadata
	 */
	public description: string;

	/**
	 * Metadata
	 */
	public required: boolean;

	public trackFeedHistory: boolean;
	public trackHistory: boolean;
	public trackTrending: boolean;
	public apiDataType: string;
	public salesforceDataType: string;

	constructor(sobjectField?: SobjectField, customField?: CustomField) {

		super(sobjectField);

		if(!customField) customField = new CustomField();

		this.description = customField.description;
		this.required = customField.required;
	}
}
