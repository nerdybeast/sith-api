import { Module } from '@nestjs/common';
import { UserController } from './user-controller';
import { UserService } from './user-service';
import { AuthService } from '../../components/services/AuthService';

@Module({
	controllers: [UserController],
	providers: [UserService, AuthService]
})
export class UserModule {}
