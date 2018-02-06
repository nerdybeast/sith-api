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

	// constructor(json?: any) {

	// 	super();
	// 	if(!json) return;

	// 	this.apexCode = json.apexCode;
	// 	this.apexProfiling = json.apexProfiling;
	// 	this.callout = json.callout;
	// 	this.database = json.database;
	// 	this.debugLevel = json.debugLevel;
	// 	this.debugLevelId = json.debugLevelId;
	// 	this.expirationDate = json.expirationDate;
	// 	this.logType = json.logType;
	// 	this.startDate = json.startDate;
	// 	this.system = json.system;
	// 	this.tracedEntityId = json.tracedEntityId;
	// 	this.validation = json.validation;
	// 	this.visualforce = json.visualforce;
	// 	this.workflow = json.workflow;
	// }
}
