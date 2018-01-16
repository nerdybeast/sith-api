import { Sobject } from './Sobject';
import { LogLevel } from '../enums/log-level';
import { LogType } from '../enums/log-type';
import { DebugLevel } from './DebugLevel';

export class TraceFlag extends Sobject {
	apexCode: LogLevel;
	apexProfiling: LogLevel;
	callout: LogLevel;
	database: LogLevel;
	debugLevel: DebugLevel;
	debugLevelId: string;
	expirationDate: string;
	logType: LogType;
	startDate: string;
	system: LogLevel;
	tracedEntityId: string;
	validation: LogLevel;
	visualforce: LogLevel;
	workflow: LogLevel;
}
