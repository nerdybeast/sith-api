import { Module, Provider } from "@nestjs/common";
import Debug from 'debug';

export const debugProvider: Provider = {
	provide: 'debug',
	useValue: Debug
};

@Module({
	providers: [
		debugProvider
	],
	exports: [
		debugProvider
	]
})
export class DebugThirdPartyModule {

}