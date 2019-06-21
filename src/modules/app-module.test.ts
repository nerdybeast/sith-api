import request from 'supertest';
import { Test } from '@nestjs/testing';
import { ApplicationModule } from '../../src/modules/app-module';
import { INestApplication } from '@nestjs/common';

describe('Application Module', () => {

	let app: INestApplication;

	beforeAll(async () => {

		const module = await Test.createTestingModule({
			imports: [ApplicationModule]
		})
		.compile();

		app = module.createNestApplication();
		await app.init();
	});

	test(`GET /`, async () => {
		const response = await request(app.getHttpServer())
			.get('/');

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('env');
	});
});