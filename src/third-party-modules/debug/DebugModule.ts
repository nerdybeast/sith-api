// import { Module, Provider, DynamicModule } from "@nestjs/common";
// import { DebugService } from "./DebugService";
// import debug from 'debug';

// @Module({})
// export class DebugModule {

// 	static register(name: string) : DynamicModule {

// 		const debugServiceProvider: Provider = {
// 			provide: DebugService,
// 			useFactory: () => {
// 				return new DebugService(name, debug);
// 			}
// 		};

// 		return {
// 			module: DebugModule,
// 			providers: [debugServiceProvider],
// 			exports: [debugServiceProvider]
// 		};
// 	}

// }

import { Module, Global } from "@nestjs/common";
import { DebugThirdPartyModule } from "./DebugThirdPartyModule";
import { DebugFactory } from "./DebugFactory";

//Global module - only needs to be registered once, usually in the root application module
@Global()
@Module({
	imports: [
		DebugThirdPartyModule
	],
	providers: [
		DebugFactory
	],
	exports: [
		DebugFactory
	]
})
export class DebugModule { }