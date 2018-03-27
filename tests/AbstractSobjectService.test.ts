import { Connection } from '../src/models/Connection';
import { ConnectionDetails } from '../src/models/ConnectionDetails';
import { AbstractSobjectService } from '../src/components/services/AbstractSobjectService';
import { Sobject } from '../src/models/sobjects/Sobject';
import { QueryResult } from '../src/models/query-result';
import { JsforceError } from '../src/models/JsforceError';
import { generateMockConnection, generateGlobalDescribe } from './helpers';
import { CrudResult } from '../src/models/CrudResult';
import { ErrorCode } from '../src/models/enums/error-code';

describe('AbstractSobjectService', () => {

	let mockSobjectService: AbstractSobjectService;

	beforeAll(() => {

		const globalDescribe = generateGlobalDescribe('MockSobject');
		const connection = generateMockConnection();
	
		class MockSobjectService extends AbstractSobjectService {
			constructor() {
				super('MockSobject', connection);
			}
			retrieve(){}
		}
	
		mockSobjectService = new MockSobjectService();
	});

	afterEach(() => {
		require('jsforce').__reset();
	});

	test('Query with valid field names', async () => {
		const queryResult = await mockSobjectService.query(['Id', 'Name']);
		expect(queryResult.records.length).toBe(1);
	});

	test('Query returns lowercase properties (to be json-api compatable)', async () => {

		const queryResult = await mockSobjectService.query(['Id', 'Name']);
		const record = queryResult.records[0];

		expect(record).toHaveProperty('id');
	});

	test('Query returns no results', async () => {

		const mockQueryResult = new QueryResult();
		mockQueryResult.records = [];

		require('jsforce').__setQueryResult(mockQueryResult);

		const queryResult = await mockSobjectService.query(['Id', 'Name']);

		expect(queryResult.records.length).toBe(0);
	});

	test('Query for invalid field throws an error', async () => {

		const mockError = new JsforceError();
		mockError.errorCode = ErrorCode.INVALID_FIELD;

		require('jsforce').__setQueryResult(undefined, mockError);

		try {
			await mockSobjectService.query(['Id', 'Name']);
		} catch(error) {
			expect(error.response.statusCode).toBe(400);
		}
	});

	test('Query [Select * From ...]', async () => {
		const queryResult = await mockSobjectService.query('*');
		expect(queryResult.records.length).toBeGreaterThan(0);
	});

	test('getSobjectFieldNames - converts keys to lowercase', async () => {
		const fielNames = await mockSobjectService.getSobjectFieldNames();
		expect(fielNames).toContain('id');
		expect(fielNames).not.toContain('Id');
	});

	test('create - success', async () => {

		const mockCrudResult = new CrudResult();
		mockCrudResult.success = true;
		mockCrudResult.id = '12345';
		mockCrudResult.errors = [];

		require('jsforce').__setCreateResult(mockCrudResult);

		const crudResult = await mockSobjectService.create({});
		expect(crudResult.success).toBe(true);
	});

	test('create - catch error', async () => {

		const mockErrorResult = new JsforceError();
		mockErrorResult.errorCode = 'SOME_SF_ERROR';
		mockErrorResult.message = 'Hey there was an error :/';

		require('jsforce').__setCreateResult(undefined, mockErrorResult);

		try {
			await mockSobjectService.create({});
		} catch(error) {
			expect(error.response.statusCode).toBe(400);
		}
	});
});
