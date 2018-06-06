import { GlobalDescribe } from '../src/models/salesforce-metadata/GlobalDescribe';
import { SobjectDescribeBase } from '../src/models/salesforce-metadata/SobjectDescribeBase';
import { QueryResult } from '../src/models/query-result';
import { Sobject } from '../src/models/sobjects/Sobject';
import { JsforceError } from '../src/models/JsforceError';
import { SobjectDescribe } from '../src/models/salesforce-metadata/SobjectDescribe';
import { SobjectField } from '../src/models/salesforce-metadata/SobjectField';
import { CrudResult } from '../src/models/CrudResult';

const jsforce: any = jest.genMockFromModule('jsforce');

let sobjectDescribe: SobjectDescribe;
let globalDescribe: GlobalDescribe;
let retrieveResult: any;
let retrieveError: any;
let createCrudResult: CrudResult;
let createErrorResult: JsforceError;
let updateCrudResult: CrudResult;
let updateErrorResult: JsforceError;
let deleteCrudResult: CrudResult;
let deleteErrorResult: JsforceError;

const sobject = new Sobject();
sobject.id = '1q2w3e4r5t6y7u8i9o';

let queryResult = generateDefaultQueryResult([sobject]);

let queryError: JsforceError;

function generateDefaultQueryResult(records: any[]) : QueryResult {
	const defaultQueryResult = new QueryResult();
	defaultQueryResult.done = true;
	defaultQueryResult.totalSize = records.length;
	defaultQueryResult.records = records;
	return defaultQueryResult;
}

jsforce.__describeGlobal = (mockGlobalDescribe: GlobalDescribe) => {
	globalDescribe = mockGlobalDescribe;
};

jsforce.__describe = (mockSobjectDescribe: SobjectDescribe) => {
	sobjectDescribe = mockSobjectDescribe;
};

jsforce.__setQueryResult = (mockQueryResult?: QueryResult, error?: JsforceError) => {
	queryResult = mockQueryResult;
	queryError = error;
};

jsforce.__setRetrieveResult = (result?: any, error?: JsforceError) => {
	retrieveResult = result;
	retrieveError = error;
};

jsforce.__setCreateResult = (mockCreateResult?: CrudResult, error?: JsforceError) => {
	createCrudResult = mockCreateResult;
	createErrorResult = error;
};

jsforce.__setUpdateResult = (mockUpdateResult?: CrudResult, error?: JsforceError) => {
	updateCrudResult = mockUpdateResult;
	updateErrorResult = error;
};

jsforce.__setDeleteResult = (mockDeleteResult?: CrudResult, error?: JsforceError) => {
	deleteCrudResult = mockDeleteResult;
	deleteErrorResult = error;
};

jsforce.__reset = function() {
	this.__setQueryResult(generateDefaultQueryResult([sobject]));
	this.__setCreateResult(undefined, undefined);
	this.__setRetrieveResult(undefined, undefined);
	this.__setUpdateResult(undefined, undefined);
	this.__setDeleteResult(undefined, undefined);
};

const conn = {

	describeGlobal() {
		return Promise.resolve(globalDescribe);
	},

	describe() {
		return Promise.resolve(sobjectDescribe);
	},

	query() {
		if(queryError) return Promise.reject(queryError);
		return Promise.resolve(queryResult);
	},

	sobject() {
		return {
			retrieve() {
				if(retrieveError) return Promise.reject(retrieveError);
				return Promise.resolve(retrieveResult);
			},
			create() {
				if(createErrorResult) return Promise.reject(createErrorResult);
				return Promise.resolve(createCrudResult);
			},
			update() {
				if(updateErrorResult) return Promise.reject(updateErrorResult);
				return Promise.resolve(updateCrudResult);
			},
			delete() {
				if(deleteErrorResult) return Promise.reject(deleteErrorResult);
				return Promise.resolve(deleteCrudResult);
			}
		};
	},

	tooling: {

		describeGlobal() {
			return Promise.resolve(globalDescribe);
		},

		describe() {
			return Promise.resolve(sobjectDescribe);
		},

		query() {
			if(queryError) return Promise.reject(queryError);
			return Promise.resolve(queryResult);
		},
	
		sobject() {
			return {
				retrieve() {
					if(retrieveError) return Promise.reject(retrieveError);
					return Promise.resolve(retrieveResult);
				},
				create() {
					if(createErrorResult) return Promise.reject(createErrorResult);
					return Promise.resolve(createCrudResult);
				},
				update() {
					if(updateErrorResult) return Promise.reject(updateErrorResult);
					return Promise.resolve(updateCrudResult);
				},
				delete() {
					if(deleteErrorResult) return Promise.reject(deleteErrorResult);
					return Promise.resolve(deleteCrudResult);
				}
			};
		}
	}
};

jsforce.Connection = () => {
	return conn;
};

module.exports = jsforce;