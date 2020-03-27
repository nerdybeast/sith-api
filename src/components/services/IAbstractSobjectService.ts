import { QueryResult } from '../../models/query-result';
import { Sobject } from '../../models/sobjects/Sobject';
import { CrudResult } from '../../models/CrudResult';

export interface IAbstractSobjectService<T extends Sobject> {
	getSobjectFieldNames(sobjectName?: string) : Promise<string[]>;
	retrieve(ids: string) : Promise<T>;
	retrieve(ids: string[]) : Promise<T[]>;
	retrieve(ids: any) : Promise<any>;
	query(fieldNames: string[] | string, whereClause?: string) : Promise<QueryResult<T>>;
	search(sosl: string) : Promise<Sobject[]>;
	create(data: any) : Promise<CrudResult>;
	create(data: any[]) : Promise<CrudResult[]>;
	create(data: any) : Promise<any>;
	update(data: any) : Promise<CrudResult>;
	update(data: any[]) : Promise<CrudResult[]>;
	update(data: any) : Promise<any>;
	delete(ids: string) : Promise<CrudResult>;
	delete(ids: string[]) : Promise<CrudResult[]>;
	delete(ids: any) : Promise<any>;
	upsert(data: any) : Promise<CrudResult>;
	upsert(data: any[]) : Promise<CrudResult[]>;
	upsert(data: any) : Promise<any>;
}