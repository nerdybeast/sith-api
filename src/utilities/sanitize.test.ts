import { escapeSpecialCharacters, soslSpecialCharacters } from './sanitize';

describe('sanitize utilities', () => {

	test('escapeSpecialCharacters - one special character', () => {
		expect(escapeSpecialCharacters('Hey! Man')).toBe('Hey\\! Man');
	});

	test('escapeSpecialCharacters - multiple special characters of same type', () => {
		expect(escapeSpecialCharacters('WO-123-456')).toBe('WO\\-123\\-456');
	});

	test('escapeSpecialCharacters - all sosl special characters contained once', () => {
		const input = soslSpecialCharacters.join(' ');
		const expectedOutput = soslSpecialCharacters.map(x => `\\${x}`).join(' ');
		expect(escapeSpecialCharacters(input)).toBe(expectedOutput);
	});

	test('escapeSpecialCharacters - all sosl special characters contained twice', () => {
		const input = soslSpecialCharacters.join(' ');
		const expectedOutput = soslSpecialCharacters.map(x => `\\${x}`).join(' ');
		expect(escapeSpecialCharacters(`${input} ${input}`)).toBe(`${expectedOutput} ${expectedOutput}`);
	});

	test('escapeSpecialCharacters - input with no special characters', () => {
		const input = `There is no spoon`;
		expect(escapeSpecialCharacters(input)).toBe(input);
	});
});