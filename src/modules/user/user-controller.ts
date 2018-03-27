import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UserService } from './user-service';
import { AuthService } from '../../components/services/AuthService';
import jwt = require('jsonwebtoken');

@Controller('api/user')
export class UserController {

	constructor(private readonly userService: UserService, private readonly authService: AuthService) {

	}

	@Get('/:user_id')
	async getById(@Param() params): Promise<any> {
		return await this.userService.get(params.user_id);
	}

	@Post('/profile')
	async getByToken(@Body() body): Promise<any> {
		const userInformation = jwt.decode(body.token) as any;
		const clientCredentials = await this.authService.getAuthToken();
		const profile = await this.authService.getProfile(clientCredentials, userInformation.sub);
		return profile;
	}
}
