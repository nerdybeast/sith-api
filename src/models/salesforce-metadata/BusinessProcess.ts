import { toBoolean } from '../../utilities/Cast';

export class BusinessProcess {
	public description: string;
	public fullname: string;
	public isActive: boolean;
	public namespacePrefix: string;
	
	//This is not the right type,
	//see: https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_globalpicklistvalue.htm#picklistvalue
	//public values: PicklistValue[];

	constructor(json: any = {}) {
		this.description = json.description;
		this.fullname = json.fullname;
		this.isActive = toBoolean(json.isActive);
		this.namespacePrefix = json.namespacePrefix;
	}
}