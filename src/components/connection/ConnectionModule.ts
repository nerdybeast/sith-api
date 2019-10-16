import { Module } from '@nestjs/common';
import { ConnectionFactory } from './ConnectionFactory';
import { CacheModule } from '../cache/CacheModule';
import { GotModule } from '../../third-party-modules/GotModule';

@Module({
	imports: [
		CacheModule,
		GotModule
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