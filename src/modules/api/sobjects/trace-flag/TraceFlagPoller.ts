import isEqual from 'lodash.isequal';
import { ConnectionDetails } from '../../../../models/ConnectionDetails';
import { IDebugLevelService } from '../../../../components/services/IDebugLevelService';
import { ITraceFlagService } from '../../../../components/services/ITraceFlagService';
import { TraceFlag } from '../../../../models/sobjects/TraceFlag';
import { UserTraceFlags } from '../../../../models/ipc/UserTraceFlags';

export class TraceFlagPoller {

	private socketIds: string[] = [];
	private connectionDetails: ConnectionDetails;
	private debugLevelService: IDebugLevelService;
	private traceFlagService: ITraceFlagService;

	constructor(
		socketId: string,
		connectionDetails: ConnectionDetails,
		debugLevelService: IDebugLevelService,
		traceFlagService: ITraceFlagService
	) {
		this.socketIds.push(socketId);
		this.connectionDetails = connectionDetails;
		this.debugLevelService = debugLevelService;
		this.traceFlagService = traceFlagService;
	}

	public addSocketId(socketId: string) : void {
		this.socketIds.push(socketId);
	}

	/**
	 * Returns true if this was the last socket id
	 * @param socketId 
	 */
	public removeSocketId(socketId: string) : boolean {
		const index = this.socketIds.findIndex(x => x === socketId);
		this.socketIds.splice(index, 1);
		return this.socketIds.length === 0;
	}

	public async poll() : Promise<void> {

		const delay = (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds));
		let existingTraceFlags: TraceFlag[];

		while(this.socketIds.length > 0) {

			await delay(5000);

			const [traceFlagFieldNames, debugLevelFieldNames] = await Promise.all([
				this.traceFlagService.getSobjectFieldNames(),
				this.debugLevelService.getSobjectFieldNames()
			]);

			const queryResult = await this.traceFlagService.query(traceFlagFieldNames, `WHERE TracedEntityId = '${this.connectionDetails.userId}'`);
			const traceFlags = queryResult.records as TraceFlag[];

			let debugLevelIds;
			let debugLevels;

			if(traceFlags.length > 0) {
				debugLevelIds = traceFlags.map(x => x.debugLevelId);
				debugLevels = await this.debugLevelService.getDebugLevels(debugLevelIds, debugLevelFieldNames);
				
				traceFlags.forEach(tf => tf.debugLevel = debugLevels.find(dl => dl.id === tf.debugLevelId));
			}
		
			if(existingTraceFlags === undefined) existingTraceFlags = traceFlags;
		
			if(!isEqual(existingTraceFlags, traceFlags)) {
				
				existingTraceFlags = traceFlags;
		
				// const usersList = connections.map(x => {
				// 	const usersTraceFlags = traceFlags.filter(tf => tf.tracedEntityId === x.userId);
				// 	return new UserTraceFlags(x.userId, usersTraceFlags);
				// });
				const userTraceFlags = new UserTraceFlags(this.connectionDetails.userId, traceFlags);
		
				//const traceFlagsUpdateIPC = new TraceFlagsUpdateIPC(usersList, traceFlagFieldNames, debugLevelFieldNames);
				console.info('userTraceFlags ==>', userTraceFlags);
				//invokeProcessFn('send', traceFlagsUpdateIPC);
			}
		}

	}
}