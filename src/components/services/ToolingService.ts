import * as got from 'got';
import * as jsforce from 'jsforce';
import { ConnectionDetails } from '../../models/ConnectionDetails';
import { Debug } from '../../utilities/debug';
import { AnonymousApexResult } from '../../models/salesforce-metadata/AnonymousApexResult';

export class ToolingService {

	private conn: any;
	protected debug: Debug;

	constructor(private connectionDetails: ConnectionDetails) {
		
		this.conn = new jsforce.Connection({
			accessToken: connectionDetails.sessionId,
			instanceUrl: connectionDetails.instanceUrl
		});

		this.debug = new Debug(`ToolingService`);
	}

	public async executeAnonymousApex(apex: string) : Promise<AnonymousApexResult> {

		this.debug.verbose(`executeAnonymousApex() params >`);
		this.debug.verbose(`apex`, apex);

		try {
			const result = await this.conn.tooling.executeAnonymous(apex);
			return result as AnonymousApexResult;
		} catch (error) {
			this.debug.error(`executeAnonymousApex error`, error);
			throw error;
		}
	}
}