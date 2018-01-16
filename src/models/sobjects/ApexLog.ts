import { Sobject } from './Sobject';

export class ApexLog extends Sobject {
	application: string;
	body: string;
	durationMilliseconds: number;
	location: string;
	logLength: number;
	logUserId: string;
	operation: string;
	request: string;
	startTime: string;
	status: string;
}