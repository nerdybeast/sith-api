import { Injectable } from '@nestjs/common';
import { AuthService } from '../../components/auth/AuthService';

@Injectable()
export class UserService {

	private readonly authService: AuthService;

	constructor(authService: AuthService) {
		this.authService = authService;
	}

	async get(userId: string) {

		const clientCredentials = await this.authService.getAuthToken();
		const profile = await this.authService.getProfile(clientCredentials, userId);

		return profile;
	}
}