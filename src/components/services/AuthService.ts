import { Component } from '@nestjs/common';
import * as got from 'got';
import { Profile } from '../../models/profile';
import { ClientCredentials } from '../../models/client-credentials';

@Component()
export class AuthService {

	async getAuthToken() : Promise<ClientCredentials> {

		const result = await got.post(`https://sith-oath.auth0.com/oauth/token`, {
			json: true,
			headers: {
				'content-type': 'application/json'
			},
			body: {
				client_id: process.env.AUTH0_API_CLIENT_ID,
				client_secret: process.env.AUTH0_API_CLIENT_SECRET,
				audience: 'https://sith-oath.auth0.com/api/v2/',
				grant_type: 'client_credentials'
			}
		});

		return result.body as ClientCredentials;
	}

	async getProfile(clientCredentials: ClientCredentials, userId: string) : Promise<Profile> {

		const result = await got.get(`https://sith-oath.auth0.com/api/v2/users/${userId}`, {
			json: true,
			headers: {
				'content-type': 'application/json',
				'Authorization': `${clientCredentials.token_type} ${clientCredentials.access_token}`
			}
		});

		return result.body as Profile;
	}

}