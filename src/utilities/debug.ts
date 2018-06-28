import debug from 'debug';

export class Debug {

	private errorDebugger;
	private warningDebugger;
	private infoDebugger;
	private verboseDebugger;

	constructor(debuggerName: string) {
		const namespace = 'SITH-API';
		this.errorDebugger = debug(`${namespace}:error:${debuggerName}`);
		this.warningDebugger = debug(`${namespace}:warning:${debuggerName}`);
		this.infoDebugger = debug(`${namespace}:info:${debuggerName}`);
		this.verboseDebugger = debug(`${namespace}:verbose:${debuggerName}`);
	}

	error(message: string, obj?: any) : void {
		this.write(this.errorDebugger, message, obj);
	}

	warning(message: string, obj?: any) : void {
		this.write(this.warningDebugger, message, obj);
	}

	info(message: string, obj?: any) : void {
		this.write(this.infoDebugger, message, obj);
	}

	verbose(message: string, obj?: any) : void {
		this.write(this.verboseDebugger, message, obj);
	}

	private write(debuggerInstance: any, message: string, obj?: any) : void {
		if(obj) {
			debuggerInstance(`${message} => %o`, obj);
		} else {
			debuggerInstance(message);
		}
	}
}