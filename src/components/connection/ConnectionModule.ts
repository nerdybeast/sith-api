import { Module } from '@nestjs/common';
import { ConnectionFactory } from './ConnectionFactory';
import { CacheModule } from '../cache/CacheModule';

@Module({
	imports: [
		CacheModule
	],
	providers: [
		ConnectionFactory
	],
	exports: [
		ConnectionFactory
	]
})
export class ConnectionModule {

}