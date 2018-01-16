import { Get, Controller } from '@nestjs/common';

@Controller()
export class AppController {

	@Get('/')
	root(): any {
		return {
			port: process.env.PORT,
			env: process.env.NODE_ENV
		};
	}
}
