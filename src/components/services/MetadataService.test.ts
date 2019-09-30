// import { generateMockConnection } from '../../test-helpers';
// import { MetadataService } from './MetadataService';

// describe('MetadataService', () => {

// 	let metadataService: MetadataService;

// 	beforeAll(() => {
// 		const connection = generateMockConnection();
// 		metadataService = new MetadataService(connection);
// 	});

// 	afterEach(() => {
// 		require('jsforce').__reset();
// 	});

// 	test('readSobjectMetadata - missing array fields get instantiated', async () => {

// 		const mockResult: any = {
// 			fullName: 'Opportunity'
// 		};

// 		require('jsforce').__setMetadataReadResult(mockResult);

// 		const customObjectReadResult = await metadataService.readSobjectMetadata('Opportunity');

// 		expect(customObjectReadResult.fullName).toBe(mockResult.fullName);
// 		expect(customObjectReadResult.fields).toHaveProperty('length');
// 		expect(customObjectReadResult.fields).toHaveLength(0);
// 	});

// 	test('readSobjectMetadata - cached result is returned', async () => {

// 		const mockResult: any = {
// 			fullName: 'Opportunity'
// 		};

// 		require('jsforce').__setMetadataReadResult(mockResult);

// 		await metadataService.readSobjectMetadata('Opportunity');

// 		require('jsforce').__setMetadataReadResult(undefined, undefined);

// 		const customObjectReadResult = await metadataService.readSobjectMetadata('Opportunity');

// 		expect(customObjectReadResult.fullName).toBe(mockResult.fullName);
// 		expect(customObjectReadResult.fields).toHaveProperty('length');
// 		expect(customObjectReadResult.fields).toHaveLength(0);
// 	});
// });

test('...', () => {});