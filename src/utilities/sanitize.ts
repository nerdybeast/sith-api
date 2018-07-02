export const soslSpecialCharacters = ['-', '?', '|', '!', '{', '}', '[', ']', '(', ')', '^', '~', '*', ':', '"', `'`, '+'];

/**
 * SOSL Special Characters => https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_sosl_find.htm?search_text=reserved
 */
export function escapeSpecialCharacters(input: string) : string {

	soslSpecialCharacters.forEach(x => input = input.replace(new RegExp(`\\${x}`, 'g'), `\\${x}`));

	return input;
}