import { ConnectionDetails } from '../../../../models/ConnectionDetails';
// import isEqual from 'lodash.isequal';
import { TraceFlagIPC } from '../../../../models/ipc/TraceFlagIPC';
// import { ApexLogService } from '../../../../components/services/ApexLogService';
// import { ApexLog } from '../../../../models/sobjects/ApexLog';
// import { ApexLogsUpdateIPC } from '../../../../models/ipc/ApexLogsUpdateIPC';
// import { Connection } from '../../../../models/Connection';

let connections: ConnectionDetails[] = [];
// let existingApexLogs: ApexLog[];
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

	// let connection = connections[0];
	// let apexLogService = new ApexLogService(new Connection(connection));

	// let [apexLogFieldNames] = await Promise.all([
	// 	apexLogService.getSobjectFieldNames()
	// ]);

	// let apexLogsWithoutBody = await apexLogService.getByUserId(connection.userId, apexLogFieldNames);

	// if(existingApexLogs === undefined) existingApexLogs = apexLogsWithoutBody;

	// if(!isEqual(existingApexLogs, apexLogsWithoutBody)) {
		
	// 	existingApexLogs = apexLogsWithoutBody;
	// 	const apexLogs = await apexLogService.attachBody(apexLogsWithoutBody);

	// 	const ipc = new ApexLogsUpdateIPC(connection.userId, apexLogs.filter(log => log.body), apexLogFieldNames);

	// 	invokeProcessFn('send', ipc);
	// }

	// connection = undefined;
	// apexLogService = undefined;
	// apexLogFieldNames = undefined;
	// apexLogsWithoutBody = undefined;

	setTimeout(() => poll(pollingRateInMilliseconds), pollingRateInMilliseconds);
}
