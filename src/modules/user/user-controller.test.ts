import jwt from 'jsonwebtoken';
import { ClientCredentials } from '../../models/client-credentials';
import { Profile } from '../../models/profile';
import { UserController } from './user-controller';
import { UserService } from './user-service';
import { AuthService } from '../../components/auth/AuthService';
import { Test } from '@nestjs/testing';
import { createConfigServiceProvider } from '../../test-helpers/config';
import { createGotProvider } from '../../test-helpers/got';

describe('User Controller', () => {

	const tokenInformation = { sub: '12345' };
	const accessToken = jwt.sign(tokenInformation, '123');
	let authService: AuthService;
	let userService: UserService;
	let userController: UserController;
	const mockConfigServiceProvider = createConfigServiceProvider();
	const mockGotProvider = createGotProvider();

	beforeEach(async () => {

		const userControllerModule = await Test.createTestingModule({
			controllers: [
				UserController
			],
			providers: [
				mockConfigServiceProvider,
				UserService,
				AuthService,
				mockGotProvider
			]
		}).compile();

		authService = userControllerModule.get<AuthService>(AuthService);
		userService = userControllerModule.get<UserService>(UserService);
		userController = userControllerModule.get<UserController>(UserController);
	});

	afterEach(() => {
		require('got').__reset();
	});

	test(`getById`, async () => {

		const params = {
			user_id: '12345'
		};

		const mockProfile = new Profile();
		mockProfile.name = 'Bruce Banner';
		mockProfile.user_id = params.user_id;

		jest.spyOn(userService, 'get').mockResolvedValue(mockProfile);
		const profile = await userController.getById(params);
		expect(profile.user_id).toBe(params.user_id);
	});

	test(`getByToken`, async () => {

		const body = {
			token: accessToken
		};

		const clientCredentials = new ClientCredentials();
		clientCredentials.access_token = accessToken;
		clientCredentials.expires_in = 60000;
		clientCredentials.scope = 'not sure';
		clientCredentials.token_type = 'Bearer';

		jest.spyOn(authService, 'getAuthToken').mockResolvedValue(clientCredentials);

		const mockProfile = new Profile();
		mockProfile.name = 'Bruce Banner';
		mockProfile.user_id = tokenInformation.sub;

		jest.spyOn(authService, 'getProfile').mockResolvedValue(mockProfile);

		const profile = await userController.getByToken(body);
		expect(profile.user_id).toBe(tokenInformation.sub);
	});

});