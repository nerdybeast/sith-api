import jwt from 'jsonwebtoken';
import { ClientCredentials } from '../../models/client-credentials';
import { Profile } from '../../models/profile';
import { UserController } from './user-controller';
import { UserService } from './user-service';
import { AuthService } from '../../components/services/AuthService';

//debugger;

describe('User Module', () => {

	const tokenInformation = { sub: '12345' };
	const accessToken = jwt.sign(tokenInformation, '123');

	beforeAll(async () => {

	});

	afterEach(() => {
		require('got').__reset();
	});

	test(`getById`, async () => {

		const params = {
			user_id: '12345'
		};

		const clientCredentials = new ClientCredentials();
		clientCredentials.access_token = accessToken;
		clientCredentials.expires_in = 60000;
		clientCredentials.scope = 'not sure';
		clientCredentials.token_type = 'Bearer';

		const mockProfile = new Profile();
		mockProfile.name = 'Bruce Banner';
		mockProfile.user_id = params.user_id;

		require('got').__setResponses([{
			success: true,
			body: clientCredentials
		}, {
			success: true,
			body: mockProfile
		}]);

		const authService = new AuthService();
		const userService = new UserService(authService);
		const userController = new UserController(userService, authService);

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

		const mockProfile = new Profile();
		mockProfile.name = 'Bruce Banner';
		mockProfile.user_id = tokenInformation.sub;

		require('got').__setResponses([{
			success: true,
			body: clientCredentials
		}, {
			success: true,
			body: mockProfile
		}]);

		const authService = new AuthService();
		const userService = new UserService(authService);
		const userController = new UserController(userService, authService);

		const profile = await userController.getByToken(body);

		expect(profile.user_id).toBe(tokenInformation.sub);
	});

});