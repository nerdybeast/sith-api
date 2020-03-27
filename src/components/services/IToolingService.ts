import { AnonymousApexResult } from '../../models/salesforce-metadata/AnonymousApexResult';
import { SobjectDescribeBase } from '../../models/salesforce-metadata/SobjectDescribeBase';
import { SobjectDescribe } from '../../models/salesforce-metadata/SobjectDescribe';

export interface IToolingService {
	executeAnonymousApex(apex: string) : Promise<AnonymousApexResult>;
	globalDescribe() : Promise<SobjectDescribeBase[]>;
	sobjectDescribe(sobjectName: string, force?: boolean) : Promise<SobjectDescribe>;
}