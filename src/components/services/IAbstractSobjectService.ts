import { QueryResult } from '../../models/query-result';
import { Sobject } from '../../models/sobjects/Sobject';
import { CrudResult } from '../../models/CrudResult';

export interface IAbstractSobjectService {
	getSobjectFieldNames(sobjectName?: string) : Promise<string[]>;
	retrieve<T>(ids: string) : Promise<T>;
	retrieve<T>(ids: string[]) : Promise<T[]>;
	retrieve<T>(ids: any) : Promise<any>;
	query(fieldNames: string[] | string, whereClause?: string) : Promise<QueryResult>;
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