import { IpcMessageType } from './enums/ipc-message-type';

export class IpcMessage {
	type: IpcMessageType;
	data: any;
	constructor(type: IpcMessageType, data: any) {
		this.type = type;
		this.data = data;
	}
}