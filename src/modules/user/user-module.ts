import { Module } from '@nestjs/common';
import { UserController } from './user-controller';
import { UserService } from './user-service';
import { AuthModule } from '../../components/auth/AuthModule';

@Module({
	imports: [
		AuthModule
	],
	controllers: [
		UserController
	],
	providers: [
		UserService
	]
})
export class UserModule {}
