import { ConnectionDetails } from "../src/models/ConnectionDetails";
import { Connection } from "../src/models/Connection";
import { AbstractSobjectService } from "../src/components/services/AbstractSobjectService";
import { SobjectField } from "../src/models/salesforce-metadata/SobjectField";
import { SobjectDescribeBase } from "../src/models/salesforce-metadata/SobjectDescribeBase";
import { SobjectDescribe } from "../src/models/salesforce-metadata/SobjectDescribe";
import { GlobalDescribe } from "../src/models/salesforce-metadata/GlobalDescribe";
import { Sobject } from "../src/models/sobjects/Sobject";

const mockConnectionDetails = new ConnectionDetails();
mockConnectionDetails.instanceUrl = 'qwqw';
mockConnectionDetails.organizationId = 'dssdsd';
mockConnectionDetails.orgVersion = '40.0';
mockConnectionDetails.sessionId = 'sdsdsd';
mockConnectionDetails.userId = 'abc';

let sobject = new Sobject();
sobject.id = '1q2w3e4r5t6y7u8i9o';

export const mockConnection = new Connection(mockConnectionDetails);

export function generateMockConnection() : Connection {
	return new Connection(mockConnectionDetails);
}

export function generateGlobalDescribe(sobjectName: string) : GlobalDescribe {

	let idField = new SobjectField();
	idField.name = 'Id';

	let nameField = new SobjectField();
	nameField.name = 'Name';

	let createdDateField = new SobjectField();
	createdDateField.name = 'CreatedDate';

	let sobjectDescribeBase = new SobjectDescribeBase();
	sobjectDescribeBase.isTooling = false;
	sobjectDescribeBase.name = sobjectName;

	let sobjectDescribe = new SobjectDescribe();
	sobjectDescribe.name = sobjectDescribeBase.name;
	sobjectDescribe.isTooling = sobjectDescribeBase.isTooling;
	sobjectDescribe.fields = [idField, nameField, createdDateField];
	require('jsforce').__describe(sobjectDescribe);

	let globalDescribe = new GlobalDescribe();
	globalDescribe.encoding = 'utf-8';
	globalDescribe.maxBatchSize = 200;
	globalDescribe.sobjects = [sobjectDescribeBase];
	require('jsforce').__describeGlobal(globalDescribe);

	return globalDescribe;
}