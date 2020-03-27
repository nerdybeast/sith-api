import { Sobject } from './sobjects/Sobject';

export class QueryResult<T extends Sobject> {
	done: boolean;
	records: T[];
	totalSize: number;
}