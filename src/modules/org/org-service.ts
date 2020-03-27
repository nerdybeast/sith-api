import { Injectable, Inject } from '@nestjs/common';
import { OrgVersion } from '../../models/org-version';
import Got from 'got';

@Injectable()
export class OrgService {

	private got: typeof Got;

	constructor(@Inject('got') got: typeof Got) {
		this.got = got;
	}

	async getVersions(instanceUrl: string) : Promise<OrgVersion[]> {

		const result = await this.got.get(`${instanceUrl}/services/data`, { json: true });
		const orgVersions = result.body;

		return orgVersions.map(version => new OrgVersion(version));
	}
}