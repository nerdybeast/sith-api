import { Injectable, Inject } from '@nestjs/common';
import Got from 'got';
import { Profile } from '../../models/profile';
import { ClientCredentials } from '../../models/client-credentials';
import { ConfigService } from '../config/ConfigService';

@Injectable()
export class AuthService {

	private configService: ConfigService;
	private got: typeof Got;

	constructor(configService: ConfigService, @Inject('got') got: typeof Got) {
		this.configService = configService;
		this.got = got;
	}

	async getAuthToken() : Promise<ClientCredentials> {

		const result = await this.got.post(`https://sith-oath.auth0.com/oauth/token`, {
			json: true,
			headers: {
				'content-type': 'application/json'
			},
			body: {
				client_id: this.configService.AUTH0_API_CLIENT_ID,
				client_secret: this.configService.AUTH0_API_CLIENT_SECRET,
				audience: 'https://sith-oath.auth0.com/api/v2/',
				grant_type: 'client_credentials'
			}
		});

		return result.body as ClientCredentials;
	}

	async getProfile(clientCredentials: ClientCredentials, userId: string) : Promise<Profile> {

		const result = await this.got.get(`https://sith-oath.auth0.com/api/v2/users/${userId}`, {
			json: true,
			headers: {
				'content-type': 'application/json',
				'Authorization': `${clientCredentials.token_type} ${clientCredentials.access_token}`
			}
		});

		return result.body as Profile;
	}

}