import { AnonymousApexResult } from '../../models/salesforce-metadata/AnonymousApexResult';
import { Connection } from '../../models/Connection';
import { AbstractSobjectService } from './AbstractSobjectService';
import { SobjectDescribeBase } from '../../models/salesforce-metadata/SobjectDescribeBase';
import { SobjectDescribe } from '../../models/salesforce-metadata/SobjectDescribe';

export class ToolingService extends AbstractSobjectService {

	constructor(connection: Connection) {
		super('Tooling', connection);
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

	public async globalDescribe() : Promise<SobjectDescribeBase[]> {
		try {
			return await this._globalDescribe(this.connectionDetails.organizationId);
		} catch (error) {
			this.debug.error(`globalDescribe() error`, error);
			throw error;
		}
	}

	public async sobjectDescribe(sobjectName: string, force: boolean = false) : Promise<SobjectDescribe> {
		try {

			return await this._describeSobject(sobjectName, this.connectionDetails.organizationId, force);

		} catch (error) {
			this.debug.error(`sobjectDescribe() error`, error);
			throw error;
		}
	}
}