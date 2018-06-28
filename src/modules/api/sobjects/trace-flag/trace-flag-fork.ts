import { TraceFlag } from '../../../../models/sobjects/TraceFlag';
import { TraceFlagService } from '../../../../components/services/TraceFlagService';
import { ConnectionDetails } from '../../../../models/ConnectionDetails';
import * as isEqual from 'lodash.isequal';
import { TraceFlagIPC } from '../../../../models/ipc/TraceFlagIPC';
import { DebugLevelService } from '../../../../components/services/DebugLevelService';
import { UserTraceFlags } from '../../../../models/ipc/UserTraceFlags';
import { TraceFlagsUpdateIPC } from '../../../../models/ipc/TraceFlagsUpdateIPC';
import { Connection } from '../../../../models/Connection';

let connections: ConnectionDetails[] = [];
let existingTraceFlags: TraceFlag[];
let pollerRunning = false;

process.on('message', (ipc: TraceFlagIPC) => {
	onMessage(ipc);
});

function onMessage(ipc: TraceFlagIPC) {
	connections = ipc.connections;
	if(!pollerRunning) {
		pollerRunning = true;
		poll(ipc.pollingRateInMilliseconds);
	}
}

function invokeProcessFn(command: string, data?: any) : void {
	
	//Not available when testing, ensure process function exists and is a function.
	if(typeof process[command] === 'function') {
		process[command](data);
	}
}

export async function poll(pollingRateInMilliseconds: number) {

	if(connections.length === 0) {
		invokeProcessFn('exit');
		return;
	}

	let connection = connections[0];

	let debugLevelService = new DebugLevelService(new Connection(connection));
	let traceFlagService = new TraceFlagService(new Connection(connection), debugLevelService);

	let [traceFlagFieldNames, debugLevelFieldNames] = await Promise.all([
		traceFlagService.getSobjectFieldNames(),
		debugLevelService.getSobjectFieldNames()
	]);

	let allUserIds = connections.map(x => x.userId);
	let soqlSafeInClause = `'${allUserIds.join(`', '`)}'`;

	let queryResult = await traceFlagService.query(traceFlagFieldNames, `WHERE TracedEntityId IN (${soqlSafeInClause})`);
	let traceFlags = queryResult.records as TraceFlag[];

	let debugLevelIds;
	let debugLevels;

	if(traceFlags.length > 0) {
		debugLevelIds = traceFlags.map(x => x.debugLevelId);
		debugLevels = await debugLevelService.getDebugLevels(debugLevelIds, debugLevelFieldNames);
		
		traceFlags.forEach(tf => tf.debugLevel = debugLevels.find(dl => dl.id === tf.debugLevelId));
	}

	if(existingTraceFlags === undefined) existingTraceFlags = traceFlags;

	if(!isEqual(existingTraceFlags, traceFlags)) {
		
		existingTraceFlags = traceFlags;

		const usersList = connections.map(x => {
			const usersTraceFlags = traceFlags.filter(tf => tf.tracedEntityId === x.userId);
			return new UserTraceFlags(x.userId, usersTraceFlags);
		});

		invokeProcessFn('send', new TraceFlagsUpdateIPC(usersList, traceFlagFieldNames, debugLevelFieldNames));
	}

	connection = undefined;
	traceFlagService = undefined;
	debugLevelService = undefined;
	traceFlagFieldNames = undefined;
	debugLevelFieldNames = undefined;
	allUserIds = undefined;
	soqlSafeInClause = undefined;
	queryResult = undefined;
	traceFlags = undefined;
	debugLevelIds = undefined;
	debugLevels = undefined;

	setTimeout(() => poll(pollingRateInMilliseconds), pollingRateInMilliseconds);
}
