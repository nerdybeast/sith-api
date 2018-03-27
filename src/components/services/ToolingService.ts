import * as got from 'got';
import * as jsforce from 'jsforce';
import { Debug } from '../../utilities/debug';
import { AnonymousApexResult } from '../../models/salesforce-metadata/AnonymousApexResult';
import { Connection } from '../../models/Connection';

export class ToolingService {

	private conn: any;
	protected debug: Debug;

	constructor(private connection: Connection) {
		this.conn = connection.jsforce;
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