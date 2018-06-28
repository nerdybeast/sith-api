import { ConnectionDetails } from '../models/ConnectionDetails';
import jsforce from 'jsforce';

export class Connection {
	
	details: ConnectionDetails;
	jsforce: any;

	constructor(details: ConnectionDetails) {

		this.details = details;

		this.jsforce = new jsforce.Connection({
			accessToken: details.sessionId,
			instanceUrl: details.instanceUrl
		});
	}
}