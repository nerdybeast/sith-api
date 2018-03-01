import { ApexLog } from '../sobjects/ApexLog';

export class ApexLogsUpdateIPC {

	public userId: string;
	public apexLogs: ApexLog[];
	public fieldNames: string[];

	constructor(userId: string, apexLogs: ApexLog[], fieldNames: string[]) {
		this.userId = userId;
		this.apexLogs = apexLogs;
		this.fieldNames = fieldNames;
	}
}