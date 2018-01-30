import { Attributes } from './Attributes';

export class Sobject {
	attributes: Attributes;
	id: string;
	isDeleted: boolean;
	createdById: string;
	createdDate: string;
	lastModifiedById: string;
	lastModifiedDate: string;
	systemModstamp: string;
}