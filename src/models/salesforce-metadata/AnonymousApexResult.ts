import { ApexLog } from '../sobjects/ApexLog';

export class AnonymousApexResult {
	
	//Force an id onto this object that will match the apex log id that way we can trace this back to a particular run.
	id: string;

	line: number;
	column: number;
	compiled: boolean;
	success: boolean;
	compileProblem: string;
	exceptionStackTrace: string;
	exceptionMessage: string;
	apexLog: ApexLog;

	public static fieldNames: string[] = [
		'id',
		'line',
		'column',
		'compiled',
		'success',
		'compileProblem',
		'exceptionStackTrace',
		'exceptionMessage',
		'apexLog'
	];
}