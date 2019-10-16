import { Module, Provider } from '@nestjs/common';
import got from 'got';

export const gotProvider: Provider = {
	provide: 'got',
	useValue: got
};

@Module({
	providers: [gotProvider],
	exports: [gotProvider]
})
export class GotModule {

}