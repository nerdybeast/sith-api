import { Debug } from '../../../../utilities/debug';
import { IpcMessage } from '../../../../models/IpcMessage';
import { IpcMessageType } from '../../../../models/enums/ipc-message-type';
import { TraceFlag } from '../../../../models/sobjects/TraceFlag';
import { TraceFlagService } from '../../../../components/services/TraceFlagService';
import { ConnectionDetails } from '../../../../models/ConnectionDetails';
import * as isEqual from 'lodash.isequal';
import { TraceFlagIPC } from '../../../../models/ipc/TraceFlagIPC';
import { DebugLevelService } from '../../../../components/services/DebugLevelService';

const debug = new Debug('trace-flag-fork');
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

	let traceFlagService = new TraceFlagService(connections[0]);
	let debugLevelService = new DebugLevelService(connections[0]);

	let [traceFlagFieldNames, debugLevelFieldNames] = await Promise.all([
		traceFlagService.getSobjectFieldNames(),
		debugLevelService.getSobjectFieldNames()
	]);

	let allUserIds = connections.map(x => x.userId);
	let soqlSafeInClause = `'${allUserIds.join(`', '`)}'`;

	let queryResult = await traceFlagService.query(traceFlagFieldNames, `WHERE TracedEntityId IN (${soqlSafeInClause})`);
	let traceFlags = queryResult.records as TraceFlag[];

	let debugLevelIds = traceFlags.map(x => x.debugLevelId);
	let debugLevels = await debugLevelService.getDebugLevels(debugLevelIds, debugLevelFieldNames);
	
	traceFlags.forEach(tf => tf.debugLevel = debugLevels.find(dl => dl.id === tf.debugLevelId));

	if(existingTraceFlags === undefined) existingTraceFlags = traceFlags;

	if(!isEqual(existingTraceFlags, traceFlags)) {
		
		existingTraceFlags = traceFlags;

		invokeProcessFn('send', { traceFlags, traceFlagFieldNames, debugLevelFieldNames });
	}

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

// const x = new ConnectionDetails();
// x.instanceUrl = 'https://vivint--DevGrnAcre.cs22.my.salesforce.com';
// x.organizationId = '00D17000000BLCaEAO';
// x.orgVersion = 'v40.0';
// x.sessionId = '00D17000000BLCa!AQoAQKE_YdYSjTTafqoR1M2OzUvDQzdOY4BRTwmjrrvF4mcs6M1vJJYn2CVAKBIbmt0yN35SYPJIV9ngXd2Zc9Y9VSgrGxX3';
// x.userId = '005G0000003pal8IAA';

// const y = new TraceFlagIPC();
// y.connections = [x];
// y.pollingRateInMilliseconds = 10;

// onMessage(y);