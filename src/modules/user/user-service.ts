import { Component } from '@nestjs/common';
import { AuthService } from '../../components/services/AuthService';

@Component()
export class UserService {

	constructor(private readonly authService: AuthService) { }

	async get(userId: string) {

		const clientCredentials = await this.authService.getAuthToken();
		const profile = await this.authService.getProfile(clientCredentials, userId);

		return profile;
	}
}