import { AuthService } from './AuthService';
import { Test } from '@nestjs/testing';
import { ClientCredentials } from '../../models/client-credentials';
import { createConfigServiceProvider } from '../../test-helpers/config';
import { Profile } from '../../models/profile';
import { createGotProvider } from '../../test-helpers/got';

describe('AuthService', () => {

	let authService: AuthService;
	let got;

	const mockClientCredentials: ClientCredentials = {
		access_token: 'abc123',
		expires_in: 123,
		scope: '',
		token_type: ''
	};

	beforeEach(async () => {

		const authModule = await Test.createTestingModule({
			providers: [
				createGotProvider(),
				AuthService,
				createConfigServiceProvider()
			]
		}).compile();

		authService = authModule.get<AuthService>(AuthService);
		got = authModule.get('got');
	});

	test('getAuthToken', async () => {
		jest.spyOn(got, 'post').mockResolvedValue({ body: mockClientCredentials });
		const clientCredentials = await authService.getAuthToken();
		expect(clientCredentials.access_token).toBe(mockClientCredentials.access_token);
	});

	test('getProfile', async () => {

		const mockProfile = new Profile();
		mockProfile.id = '001qawsedrftg';

		jest.spyOn(got, 'get').mockResolvedValue({ body: mockProfile });

		const profile = await authService.getProfile(mockClientCredentials, mockProfile.id);
		expect(profile.id).toBe(mockProfile.id);
	});

});