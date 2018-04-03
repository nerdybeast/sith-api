import { UserTraceFlags } from './UserTraceFlags';

export class TraceFlagsUpdateIPC {

	public traceFlagsByUser: UserTraceFlags[];
	public traceFlagFieldNames: string[];
	public debugLevelFieldNames: string[];

	constructor(traceFlagsByUser: UserTraceFlags[], traceFlagFieldNames: string[], debugLevelFieldNames: string[]) {
		this.traceFlagsByUser = traceFlagsByUser;
		this.traceFlagFieldNames = traceFlagFieldNames;
		this.debugLevelFieldNames = debugLevelFieldNames;
	}
}