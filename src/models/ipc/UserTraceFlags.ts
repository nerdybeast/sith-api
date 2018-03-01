import { TraceFlag } from '../sobjects/TraceFlag';

export class UserTraceFlags {
	constructor(public userId: string, public traceFlags: TraceFlag[]) { }
}