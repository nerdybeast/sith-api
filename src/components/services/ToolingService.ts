import { AnonymousApexResult } from '../../models/salesforce-metadata/AnonymousApexResult';
import { Connection } from '../../models/Connection';
import { AbstractSobjectService } from './AbstractSobjectService';
import { SobjectDescribeBase } from '../../models/salesforce-metadata/SobjectDescribeBase';
import { SobjectDescribe } from '../../models/salesforce-metadata/SobjectDescribe';
import { IToolingService } from './IToolingService';
import { ICache } from '../../interfaces/ICache';
import { Sobject } from '../../models/sobjects/Sobject';
import { DebugFactory } from '../../third-party-modules/debug/DebugFactory';

export class ToolingService extends AbstractSobjectService<Sobject> implements IToolingService {

	constructor(connection: Connection, cache: ICache, debugFactory: DebugFactory) {
		super('Tooling', connection, cache, debugFactory);
	}

	public async executeAnonymousApex(apex: string) : Promise<AnonymousApexResult> {

		this.debugService.verbose(`executeAnonymousApex() params >`);
		this.debugService.verbose(`apex`, apex);

		try {
			const result = await this.conn.tooling.executeAnonymous(apex);
			return result as AnonymousApexResult;
		} catch (error) {
			this.debugService.error(`executeAnonymousApex error`, error);
			throw error;
		}
	}

	public async globalDescribe() : Promise<SobjectDescribeBase[]> {
		try {
			return await this._globalDescribe(this.connectionDetails.organizationId);
		} catch (error) {
			this.debugService.error(`globalDescribe() error`, error);
			throw error;
		}
	}

	public async sobjectDescribe(sobjectName: string, force: boolean = false) : Promise<SobjectDescribe> {
		try {

			return await this._describeSobject(sobjectName, this.connectionDetails.organizationId, force);

		} catch (error) {
			this.debugService.error(`sobjectDescribe() error`, error);
			throw error;
		}
	}
}