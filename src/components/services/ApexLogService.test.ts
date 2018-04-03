import { ApexLogService } from './ApexLogService';
import { QueryResult } from '../../models/query-result';
import { generateMockConnection, generateGlobalDescribe } from '../../test-helpers';
import { ApexLog } from '../../models/sobjects/ApexLog';

describe('ApexLogService', () => {

	let apexLogService: ApexLogService;

	beforeAll(() => {

		generateGlobalDescribe('ApexLog');

		const connection = generateMockConnection();
		apexLogService = new ApexLogService(connection);
	});

	afterEach(() => {
		require('jsforce').__reset();
		require('got').__reset();
	});

	test('retrieve - single apex log', async () => {

		// debugger;

		const mockApexLog = new ApexLog();
		mockApexLog.id = '12345';
		mockApexLog.application = '/services/apexrest/abc';

		require('jsforce').__setRetrieveResult(mockApexLog);

		const apexLog = await apexLogService.retrieve(mockApexLog.id);

		expect(apexLog.id).toBe(mockApexLog.id);
	});

	test('retrieve - multiple apex logs', async () => {

		// debugger;

		const mockApexLog1 = new ApexLog();
		mockApexLog1.id = '12345';
		mockApexLog1.application = '/services/apexrest/abc';

		const mockApexLog2 = new ApexLog();
		mockApexLog2.id = '678910';
		mockApexLog2.application = '/services/apexrest/abc';

		require('jsforce').__setRetrieveResult([mockApexLog1, mockApexLog2]);

		const apexLogs = await apexLogService.retrieve([mockApexLog1.id, mockApexLog2.id]);

		expect(apexLogs).toHaveLength(2);
	});

	test('getByUserId', async () => {

		const mockApexLog = new ApexLog();
		mockApexLog.id = '12345';
		mockApexLog.application = '/services/apexrest/abc';

		const mockQueryResult = new QueryResult();
		mockQueryResult.done = true;
		mockQueryResult.totalSize = 1;
		mockQueryResult.records = [mockApexLog];

		require('jsforce').__setQueryResult(mockQueryResult);

		const apexLogs = await apexLogService.getByUserId('12345', ['Id']);
		expect(apexLogs.length).toBe(1);
		expect(apexLogs[0].id).toBe(mockApexLog.id);
	});

	test('getDebugLog - body exists - success', async () => {

		const mockResult = 'abc';

		//Adding leading/trailing spaces on purpose to ensure our function trims the response.
		require('got').__setResponse(`  ${mockResult}  `);

		const result = await apexLogService.getDebugLog('12345');
		expect(result).toBe(mockResult);
	});

	test('getDebugLog - body is null - success', async () => {

		require('got').__setResponse(null);

		const result = await apexLogService.getDebugLog('12345');
		expect(result).toBe('');
	});

	test('getDebugLog - error is handled', async () => {

		// debugger;

		const mockError = new Error('Some Error');
		require('got').__setResponse(undefined, mockError);

		try {
			await apexLogService.getDebugLog('12345');
		} catch(error) {
			expect(error.message).toBe(mockError.message);
		}
	});

	test('attachBody - 1 ApexLog - has body', async () => {

		const mockDebugLogBody = 'abc';
		const mockApexLogId = '12345';

		const mockApexLog = new ApexLog();
		mockApexLog.id = mockApexLogId;

		require('got').__setResponse(mockDebugLogBody);

		const apexLogs = await apexLogService.attachBody([mockApexLog]);
		expect(apexLogs).toHaveLength(1);
		expect(apexLogs[0].id).toBe(mockApexLogId);
		expect(apexLogs[0].body).toBe(mockDebugLogBody);
	});

	test('attachBody - 1 ApexLog record but no DebugLog record to match', async () => {

		const mockApexLogId = '12345';

		const mockApexLog = new ApexLog();
		mockApexLog.id = mockApexLogId;

		require('got').__setResponse(null);

		const apexLogs = await apexLogService.attachBody([mockApexLog]);
		expect(apexLogs).toHaveLength(1);
		expect(apexLogs[0].id).toBe(mockApexLogId);
		expect(apexLogs[0].body).toBeUndefined();
	});

	test('getApexLogs - success', async () => {

		const mockApexLog = new ApexLog();
		mockApexLog.id = '12345';
		mockApexLog.application = '/services/apexrest/abc';

		const mockQueryResult = new QueryResult();
		mockQueryResult.done = true;
		mockQueryResult.totalSize = 1;
		mockQueryResult.records = [mockApexLog];

		require('jsforce').__setQueryResult(mockQueryResult);

		const mockDebugLogBody = 'abc';
		require('got').__setResponse(mockDebugLogBody);

		const apexLogs = await apexLogService.getApexLogs('1a2b3c', ['Id', 'Name']);
		expect(apexLogs).toHaveLength(1);
		expect(apexLogs[0].id).toBe(mockApexLog.id);
		expect(apexLogs[0].body).toBe(mockDebugLogBody);
	});
});
