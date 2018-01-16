import { Sobject } from './Sobject';
import { LogLevel } from '../enums/log-level';

export class DebugLevel extends Sobject {
	apexCode: LogLevel;
	apexProfiling: LogLevel;
	callout: LogLevel;
	database: LogLevel;
	developerName: string;
	language: string;
	masterLabel: string;
	system: LogLevel;
	validation: LogLevel;
	visualforce: LogLevel;
	workflow: LogLevel;
}