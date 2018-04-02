import { ConnectionDetails } from '../models/ConnectionDetails';
import { Connection } from '../models/Connection';
import { SobjectField } from '../models/salesforce-metadata/SobjectField';
import { SobjectDescribeBase } from '../models/salesforce-metadata/SobjectDescribeBase';
import { SobjectDescribe } from '../models/salesforce-metadata/SobjectDescribe';
import { GlobalDescribe } from '../models/salesforce-metadata/GlobalDescribe';
import { Sobject } from '../models/sobjects/Sobject';

const mockConnectionDetails = new ConnectionDetails();
mockConnectionDetails.instanceUrl = 'qwqw';
mockConnectionDetails.organizationId = 'dssdsd';
mockConnectionDetails.orgVersion = '40.0';
mockConnectionDetails.sessionId = 'sdsdsd';
mockConnectionDetails.userId = 'abc';

const sobject = new Sobject();
sobject.id = '1q2w3e4r5t6y7u8i9o';

export const mockConnection = new Connection(mockConnectionDetails);

export function generateMockConnection() : Connection {
	return new Connection(mockConnectionDetails);
}

export function generateGlobalDescribe(sobjectName: string) : GlobalDescribe {

	const idField = new SobjectField();
	idField.name = 'Id';

	const nameField = new SobjectField();
	nameField.name = 'Name';

	const createdDateField = new SobjectField();
	createdDateField.name = 'Crea0tedDate';

	const sobjectDescribeBase = new SobjectDescribeBase();
	sobjectDescribeBase.isTooling = false;
	sobjectDescribeBase.name = sobjectName;

	const sobjectDescribe = new SobjectDescribe();
	sobjectDescribe.name = sobjectDescribeBase.name;
	sobjectDescribe.isTooling = sobjectDescribeBase.isTooling;
	sobjectDescribe.fields = [idField, nameField, createdDateField];
	require('jsforce').__describe(sobjectDescribe);

	const globalDescribe = new GlobalDescribe();
	globalDescribe.encoding = 'utf-8';
	globalDescribe.maxBatchSize = 200;
	globalDescribe.sobjects = [sobjectDescribeBase];
	require('jsforce').__describeGlobal(globalDescribe);

	return globalDescribe;
}