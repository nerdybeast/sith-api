import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UserService } from './user-service';
import { AuthService } from '../../components/auth/AuthService';
import jwt = require('jsonwebtoken');
import { Profile } from '../../models/profile';
import { TokenInformation } from '../../models/TokenInformation';
import { DebugService } from '../../third-party-modules/debug/DebugService';
import { DebugFactory } from '../../third-party-modules/debug/DebugFactory';

@Controller('api/user')
export class UserController {

	private readonly userService: UserService;
	private readonly authService: AuthService;
	private readonly debugService: DebugService;

	constructor(userService: UserService, authService: AuthService, debugFactory: DebugFactory) {
		this.userService = userService;
		this.authService = authService;
		this.debugService = debugFactory.create('UserController');
	}

	@Get('/:user_id')
	async getById(@Param() params): Promise<Profile> {
		this.debugService.verbose('params', params);
		return await this.userService.get(params.user_id);
	}

	@Post('/profile')
	async getByToken(@Body() body): Promise<Profile> {

		this.debugService.verbose('body', body);

		const tokenInformation = jwt.decode(body.token) as TokenInformation;
		const clientCredentials = await this.authService.getAuthToken();
		const profile = await this.authService.getProfile(clientCredentials, tokenInformation.sub);

		return profile;
	}
}
