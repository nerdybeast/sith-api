import { EventEmitter } from 'events';
import isEqual from 'lodash.isequal';
import { ConnectionDetails } from '../../../../models/ConnectionDetails';
import { IDebugLevelService } from '../../../../components/services/IDebugLevelService';
import { ITraceFlagService } from '../../../../components/services/ITraceFlagService';
import { TraceFlag } from '../../../../models/sobjects/TraceFlag';
import { UserTraceFlags } from '../../../../models/ipc/UserTraceFlags';
import { TraceFlagsUpdateIPC } from '../../../../models/ipc/TraceFlagsUpdateIPC';

export class TraceFlagPoller extends EventEmitter {

	private socketIds: string[] = [];
	private connectionDetails: ConnectionDetails;
	private debugLevelService: IDebugLevelService;
	private traceFlagService: ITraceFlagService;
	private existingTraceFlags: TraceFlag[];

	constructor(
		socketId: string,
		connectionDetails: ConnectionDetails,
		debugLevelService: IDebugLevelService,
		traceFlagService: ITraceFlagService
	) {
		super();
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

		if(index !== -1) {
			this.socketIds.splice(index, 1);
		}

		return this.socketIds.length === 0;
	}

	public async poll() : Promise<void> {

		if(this.socketIds.length === 0) {
			return;
		}

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
	
		if(this.existingTraceFlags === undefined) this.existingTraceFlags = traceFlags;
	
		if(!isEqual(this.existingTraceFlags, traceFlags)) {

			this.existingTraceFlags = traceFlags;
	
			const userTraceFlags = new UserTraceFlags(this.connectionDetails.userId, traceFlags);
	
			const traceFlagsUpdateIPC = new TraceFlagsUpdateIPC([userTraceFlags], traceFlagFieldNames, debugLevelFieldNames);
			//console.info('userTraceFlags ==>', userTraceFlags);
			this.emit('traceFlagsUpdate', traceFlagsUpdateIPC);
		}

		setTimeout(() => this.poll(), Number(process.env.TRACE_FLAG_POLLING_RATE || '5000'));
	}
}