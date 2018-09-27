import { toBoolean } from '../../utilities/Cast';

export class PicklistValue {
	active: boolean;
	defaultValue: boolean;
	label: string;
	
	/**
	 * TODO: Construct an object here that shows which picklist values are available for which record types...
	 */
	validFor: any;

	value: string;

	//GlobalPicklistValue properties

	/**
	 * The color assigned to the picklist value when it’s used in charts on reports and dashboards. The color is in hexadecimal format; for example, #FF6600. If a color is not specified, it’s assigned dynamically upon chart generation.
	 */
	color: string;
	default: boolean;
	description: string;
	isActive: boolean;

	/**
	 * No idea where this field is coming from but Jsforce is returning it...
	 */
	fullName: string;

	constructor(json: any = {}) {
		this.active = toBoolean(json.active);
		this.defaultValue = toBoolean(json.defaultValue);
		this.label = json.label || null;
		this.validFor = json.validFor;
		this.value = json.value || null;
		this.color = json.color || null;
		this.default = toBoolean(json.default);
		this.description = json.description || null;
		this.isActive = toBoolean(json.isActive);
		this.fullName = json.fullName || null;
	}
}