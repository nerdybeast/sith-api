import { FileProperties } from '../../models/salesforce-metadata/FileProperties';
import { CustomObjectReadResult } from '../../models/salesforce-metadata/CustomObjectReadResult';

export interface IMetadataService {
	listCustomObjectTypes() : Promise<FileProperties[]>;
	readSobjectMetadata(sobjectName: string, force: boolean) : Promise<CustomObjectReadResult>;
	sobjectHasChanged(sobjectName: string, fileProperties: FileProperties) : Promise<boolean>;
}