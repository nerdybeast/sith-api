import { Debug } from "../src/utilities/debug";


describe('Debug', () => {

	test('Can construct debug class', () => {
		const debug = new Debug('test');
	});

	test('Can debug an error', () => {
		const debug = new Debug('test');
		debug.error('something');
		debug.error('something', null);
		debug.error('something', {});
		debug.error('something', 'abc');
		debug.error('something', 123);
	});

	test('Can debug a warning', () => {
		const debug = new Debug('test');
		debug.warning('something');
		debug.warning('something', null);
		debug.warning('something', {});
		debug.warning('something', 'abc');
		debug.warning('something', 123);
	});

	test('Can debug an info message', () => {
		const debug = new Debug('test');
		debug.info('something');
		debug.info('something', null);
		debug.info('something', {});
		debug.info('something', 'abc');
		debug.info('something', 123);
	});

	test('Can debug a verbose', () => {
		const debug = new Debug('test');
		debug.verbose('something');
		debug.verbose('something', null);
		debug.verbose('something', {});
		debug.verbose('something', 'abc');
		debug.verbose('something', 123);
	});

});