import { AbstractSobjectService } from './AbstractSobjectService';
import { QueryResult } from '../../models/query-result';
import { JsforceError } from '../../models/JsforceError';
import { generateMockConnection, generateGlobalDescribe } from '../../test-helpers';
import { CrudResult } from '../../models/CrudResult';
import { ErrorCode } from '../../models/enums/error-code';

describe('AbstractSobjectService', () => {

	let mockSobjectService: AbstractSobjectService;

	beforeAll(() => {

		generateGlobalDescribe('MockSobject');
		const connection = generateMockConnection();
	
		class MockSobjectService extends AbstractSobjectService {
			constructor() {
				super('MockSobject', connection);
			}
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

		const mockError = new JsforceError(ErrorCode.INVALID_FIELD, '');

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

		const mockErrorResult = new JsforceError(ErrorCode.INVALID_FIELD, 'Hey there was an error :/');

		require('jsforce').__setCreateResult(undefined, mockErrorResult);

		try {
			await mockSobjectService.create({});
		} catch(error) {
			expect(error.response.statusCode).toBe(400);
		}
	});

	test('update - success', async () => {

		const mockCrudResult = new CrudResult();
		mockCrudResult.success = true;
		mockCrudResult.id = '12345';
		mockCrudResult.errors = [];

		require('jsforce').__setUpdateResult(mockCrudResult);

		const crudResult = await mockSobjectService.update({});
		expect(crudResult.success).toBe(true);
	});

	test('update - catch error', async () => {

		const mockErrorResult = new JsforceError(ErrorCode.INVALID_FIELD, 'Hey there was an error :/');

		require('jsforce').__setUpdateResult(undefined, mockErrorResult);

		try {
			await mockSobjectService.update({});
		} catch(error) {
			expect(error.response.statusCode).toBe(400);
		}
	});

	test('delete - success', async () => {

		const mockCrudResult = new CrudResult();
		mockCrudResult.success = true;
		mockCrudResult.id = '12345';
		mockCrudResult.errors = [];

		require('jsforce').__setDeleteResult(mockCrudResult);

		const crudResult = await mockSobjectService.delete('');
		expect(crudResult.success).toBe(true);
	});

	test('delete - catch error', async () => {

		const mockErrorResult = new JsforceError(ErrorCode.INVALID_FIELD, 'Hey there was an error :/');

		require('jsforce').__setDeleteResult(undefined, mockErrorResult);

		try {
			await mockSobjectService.delete('');
		} catch(error) {
			expect(error.response.statusCode).toBe(400);
		}
	});
});
