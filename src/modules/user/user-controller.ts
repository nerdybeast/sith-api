import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UserService } from './user-service';
import { AuthService } from '../../components/auth/AuthService';
import jwt = require('jsonwebtoken');
import { Debug } from '../../utilities/debug';
import { Profile } from '../../models/profile';
import { TokenInformation } from '../../models/TokenInformation';

@Controller('api/user')
export class UserController {

	private debug: Debug;

	constructor(private readonly userService: UserService, private readonly authService: AuthService) {
		this.debug = new Debug('UserController');
	}

	@Get('/:user_id')
	async getById(@Param() params): Promise<Profile> {
		this.debug.verbose('params', params);
		return await this.userService.get(params.user_id);
	}

	@Post('/profile')
	async getByToken(@Body() body): Promise<Profile> {

		this.debug.verbose('body', body);

		const tokenInformation = jwt.decode(body.token) as TokenInformation;
		const clientCredentials = await this.authService.getAuthToken();
		const profile = await this.authService.getProfile(clientCredentials, tokenInformation.sub);

		return profile;
	}
}
