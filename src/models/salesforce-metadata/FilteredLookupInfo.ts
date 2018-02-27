/**

Example from the Case object, ContactId field:

"filteredLookupInfo": {
	"controllingFields": [
		"AccountId"
	],
	"dependent": true,
	"optionalFilter": true
}

*/
export class FilteredLookupInfo {
	controllingFields: string[];
	dependent: boolean;
	optionalFilter: boolean;
}