import { toArray } from '../../utilities/Cast';

export class SearchLayouts {
	public customTabListAdditionalFields: string[];
	public excludedStandardButtons: string[];
	public listViewButtons: string[];
	public lookupDialogsAdditionalFields: string[];
	public lookupFilterFields: string[];
	public lookupPhoneDialogsAdditionalFields: string[];
	public searchFilterFields: string[];
	public searchResultsAdditionalFields: string[];
	public searchResultsCustomButtons: string[];

	constructor(json: any = {}) {
		this.customTabListAdditionalFields = toArray(json.customTabListAdditionalFields).map(x => x || null);
		this.excludedStandardButtons = toArray(json.excludedStandardButtons).map(x => x || null);
		this.listViewButtons = toArray(json.listViewButtons).map(x => x || null);
		this.lookupDialogsAdditionalFields = toArray(json.lookupDialogsAdditionalFields).map(x => x || null);
		this.lookupFilterFields = toArray(json.lookupFilterFields).map(x => x || null);
		this.lookupPhoneDialogsAdditionalFields = toArray(json.lookupPhoneDialogsAdditionalFields).map(x => x || null);
		this.searchFilterFields = toArray(json.searchFilterFields).map(x => x || null);
		this.searchResultsAdditionalFields = toArray(json.searchResultsAdditionalFields).map(x => x || null);
		this.searchResultsCustomButtons = toArray(json.searchResultsCustomButtons).map(x => x || null);
	}
}