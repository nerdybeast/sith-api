import { Controller, Get, Post, Headers, UseInterceptors } from '@nestjs/common';
import { OrgService } from './org-service';
import { OrgVersion } from '../../models/org-version';
import { IResponse } from '../../interfaces/IResponse';
import * as jsonapi from 'jsonapi-serializer';

@Controller('api/org')
export class OrgController {

	constructor(private readonly orgService: OrgService) {

	}

	@Get('/versions')
	async getVersions(@Headers() headers): Promise<any> {
		
		const versions = await this.orgService.getVersions(headers['instance-url']);
		
		return new jsonapi.Serializer('org-version', {
			attributes: ['label', 'version', 'url'],
			keyForAttribute: 'camelCase'
		}).serialize(versions);
	}

}
