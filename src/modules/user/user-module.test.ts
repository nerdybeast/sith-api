import request from 'supertest';
import jwt from 'jsonwebtoken';
import { Test } from '@nestjs/testing';
import { ApplicationModule } from '../app-module';
import { ClientCredentials } from '../../models/client-credentials';
import { Profile } from '../../models/profile';
import { INestApplication } from '@nestjs/common';

//debugger;

describe('User Module', () => {

	const tokenInformation = { sub: '12345' };
	const accessToken = jwt.sign(tokenInformation, '123');
	let app: INestApplication;

	beforeAll(async () => {

		const module = await Test.createTestingModule({
			imports: [ApplicationModule]
		})
		.compile();

		app = module.createNestApplication();
		await app.init();
	});

	afterEach(() => {
		require('got').__reset();
	});

	test(`GET /api/user/:user_id`, async () => {

		const clientCredentials = new ClientCredentials();
		clientCredentials.access_token = accessToken;
		clientCredentials.expires_in = 60000;
		clientCredentials.scope = 'not sure';
		clientCredentials.token_type = 'Bearer';

		const profile = new Profile();
		profile.name = 'Bruce Banner';

		require('got').__setResponses([{
			success: true,
			body: clientCredentials
		}, {
			success: true,
			body: profile
		}]);

		const response = await request(app.getHttpServer())
			.get('/api/user/12345');

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('name');
		expect(response.body.name).toBe(profile.name);
	});

	test(`GET /api/user/profile`, async () => {
		
		const clientCredentials = new ClientCredentials();
		clientCredentials.access_token = accessToken;
		clientCredentials.expires_in = 60000;
		clientCredentials.scope = 'not sure';
		clientCredentials.token_type = 'Bearer';

		const profile = new Profile();
		profile.name = 'Bruce Banner';

		require('got').__setResponses([{
			success: true,
			body: clientCredentials
		}, {
			success: true,
			body: profile
		}]);

		const response = await request(app.getHttpServer())
			.post('/api/user/profile')
			.send({ token: accessToken });

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty('name');
		expect(response.body.name).toBe(profile.name);
	});
});