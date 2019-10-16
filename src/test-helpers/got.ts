import { Provider } from '@nestjs/common';

export function createGotProvider() : Provider {

	return {
		provide: 'got',
		useValue: {
			get() {},
			post() {}
		}
	};

}