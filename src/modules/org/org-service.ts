import { Component } from '@nestjs/common';
import { OrgVersion } from '../../models/org-version';
import * as got from 'got';

@Component()
export class OrgService {

	constructor() { }

	async getVersions(instanceUrl: string) : Promise<OrgVersion[]> {

		const result = await got(`${instanceUrl}/services/data`, { json: true });
		const orgVersions = result.body;

		return orgVersions.map(version => new OrgVersion(version));
	}
}