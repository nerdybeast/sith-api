import { Test } from '@nestjs/testing';
import { UserService } from './user-service';
import { AuthService } from '../../components/services/AuthService';
import { ClientCredentials } from '../../models/client-credentials';
import { Profile } from '../../models/profile';

describe('UserService', () => {

	let userService: UserService;
	let authService: AuthService;

	beforeEach(async () => {

		const testingModule = await Test.createTestingModule({
			providers: [
				UserService,
				AuthService
			]
		}).compile();

		userService = testingModule.get<UserService>(UserService);
		authService = testingModule.get<AuthService>(AuthService);
	});

	test('get user by id', async () => {

		const mockProfile = new Profile();
		mockProfile.id = '1234';

		jest.spyOn(authService, 'getAuthToken').mockResolvedValue(new ClientCredentials());
		jest.spyOn(authService, 'getProfile').mockResolvedValue(mockProfile);

		const profile = await userService.get(mockProfile.id);
		expect(profile.id).toBe(mockProfile.id);
	});

});