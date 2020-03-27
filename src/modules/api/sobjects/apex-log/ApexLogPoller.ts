import { EventEmitter } from 'events';
import isEqual from 'lodash.isequal';
import { ConnectionDetails } from '../../../../models/ConnectionDetails';
import { IApexLogService } from '../../../../components/services/IApexLogService';
import { ApexLogsUpdateIPC } from '../../../../models/ipc/ApexLogsUpdateIPC';
import { ApexLog } from '../../../../models/sobjects/ApexLog';
import { ConfigService } from '../../../../components/config/ConfigService';

export class ApexLogPoller extends EventEmitter {

	private socketIds: string[] = [];
	private connectionDetails: ConnectionDetails;
	private apexLogService: IApexLogService;
	private existingApexLogIds: string[];
	private configService: ConfigService;

	constructor(socketId: string, connectionDetails: ConnectionDetails, apexLogService: IApexLogService, configService: ConfigService) {
		super();
		this.socketIds.push(socketId);
		this.connectionDetails = connectionDetails;
		this.apexLogService = apexLogService;
		this.configService = configService;
	}

	public get HasClients() : boolean {
		return this.socketIds.length > 0;
	}

	public addSocketId(socketId: string) : void {
		this.socketIds.push(socketId);
	}

	public removeSocketId(socketId: string) : void {

		const index = this.socketIds.findIndex(x => x === socketId);

		if(index !== -1) {
			this.socketIds.splice(index, 1);
		}

		return;
	}

	public async poll() : Promise<void> {

		if(this.socketIds.length === 0) {
			return;
		}

		const apexLogFieldNames = await this.apexLogService.getSobjectFieldNames();
		const apexLogsWithoutBody = await this.apexLogService.getByUserId(this.connectionDetails.userId, apexLogFieldNames);
		const apexLogsWithoutBodyIds = apexLogsWithoutBody.map((apexLog: ApexLog) => apexLog.id);

		if(this.existingApexLogIds === undefined) {
			this.existingApexLogIds = apexLogsWithoutBodyIds;
		}

		if(!isEqual(this.existingApexLogIds, apexLogsWithoutBodyIds)) {

			this.existingApexLogIds = apexLogsWithoutBodyIds;

			const apexLogs = await this.apexLogService.attachBody(apexLogsWithoutBody);
			const apexLogsUpdateIPC = new ApexLogsUpdateIPC(this.connectionDetails.userId, apexLogs, apexLogFieldNames);

			this.emit('apexLogsUpdate', apexLogsUpdateIPC);
		}

		setTimeout(() => this.poll(), this.configService.APEX_LOG_POLLING_RATE);
	}
}