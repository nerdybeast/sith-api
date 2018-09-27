import { DescribeMetadataObject } from './DescribeMetadataObject';

export class DescribeMetadataResult {
	public metadataObjects: DescribeMetadataObject[];
	public organizationNamespace: string;
	public partialSaveAllowed: boolean;
	public testRequired: boolean;
}