import { Module } from '@nestjs/common';
import { AuthService } from './AuthService';
import { GotModule } from '../../third-party-modules/GotModule';

@Module({
	imports: [
		GotModule
	],
	providers: [
		AuthService
	],
	exports: [
		AuthService
	]
})
export class AuthModule {

}