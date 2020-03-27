import { Sobject } from './sobjects/Sobject';

export class SearchResult<T extends Sobject> {
	searchRecords: T[];
}