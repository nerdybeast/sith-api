import * as express from 'express';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { ApplicationModule } from '../../src/modules/app-module';

describe('Application Module', () => {

	const server = express();

	beforeAll(async () => {

		const module = await Test.createTestingModule({
			modules: [ApplicationModule]
		})
		.compile();

		const app = module.createNestApplication(server);
		await app.init();
	});

	test(`GET /`, async () => {
		const response = await request(server)
			.get('/');

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('env');
	});
});