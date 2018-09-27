import { ConnectionDetails } from '../models/ConnectionDetails';
import Jsforce from 'jsforce';

export class Connection {
	
	details: ConnectionDetails;
	jsforce: any;

	constructor(details: ConnectionDetails) {

		this.details = details;

		this.jsforce = new Jsforce.Connection({
			accessToken: details.sessionId,
			instanceUrl: details.instanceUrl
		});
	}
}