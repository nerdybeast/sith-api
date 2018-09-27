import { Metadata } from './Metadata';
import { DeleteConstraint } from '../enums/DeleteConstraint';
import { TreatBlanksAs } from '../enums/TreatBlanksAs';
import { SummaryOperations } from '../enums/SummaryOperations';
import { LookupFilter } from './LookupFilter';
import { FilterItem } from './FilterItem';
import { FieldType } from '../enums/FieldType';
import { toBoolean, toNumber, toArray } from '../../utilities/Cast';

/**
 * https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/customfield.htm
 */
export class CustomField extends Metadata {
	public caseSensitive: boolean;
	public customDataType: string;
	public defaultValue: string;
	public deleteConstraint: DeleteConstraint;
	public deprecated: boolean;
	public description: string;
	public displayFormat: string;
	
	/**
	 * Indicates how the geolocation values of a Location custom field appears in the user interface. If true, the geolocation values appear in decimal notation. If false, the geolocation values appear as degrees, minutes, and seconds.
	 */
	public displayLocationInDecimal: boolean;

	public encrypted: boolean;
	public externalDeveloperName: string;
	public externalId: boolean;
	public fieldManageability: string;
	public formula: string;
	public formulaTreatBlankAs: TreatBlanksAs;
	
	/**
	 * (This field is available in API version 37.0 only and removed from later versions.) If this custom field is a picklist that’s based on a global picklist, globalPicklist is the name of the global picklist whose value set this picklist inherits. A custom picklist that’s based on a global picklist is restricted. You can only add or remove values by editing the global picklist.
	 */
	public globalPicklist: string;
	
	public indexed: boolean;
	public inlineHelpText: string;

	/**
	 * Available only for external objects. Indicates whether the custom field is available in filters. This field is available in API version 32.0 and later.
	 */
	public isFilteringDisabled: boolean;
	
	/**
	 * Available only for external object fields of type text. For each external object, you can specify one field as the name field. If you set this to true, make sure that the external table column identified by the externalDeveloperName attribute contains name values. This field is available in API version 32.0 and later.
	 */
	public isNameField: boolean;
	
	/**
	 * Available only for external objects. Indicates whether the custom field is sortable. This field is available in API version 32.0 and later.
	 */
	public isSortingDisabled: boolean;

	public reparentableMasterDetail: boolean;
	public label: string;
	public length: number;
	public lookupFilter: LookupFilter;
	public populateExistingRows: boolean;
	public precision: number;
	public referenceTargetField: string;
	public referenceTo: string;
	public relationshipLabel: string;
	public relationshipName: string;
	public relationshipOrder: number;
	public required: boolean;
	public scale: number;
	public startingNumber: number;
	public stripMarkup: boolean;
	public summarizedField: string;
	public summaryFilterItems: FilterItem[];
	public summaryForeignKey: string;
	public summaryOperation: SummaryOperations;
	public trackFeedHistory: boolean;
	public trackHistory: boolean;
	public trackTrending: boolean;
	public trueValueIndexed: boolean;
	public type: FieldType;
	public unique: boolean;
	
	//Salesforce docs didn't describe what this model looks like.
	//valueSet: ValueSet;
	
	public visibleLines: number;
	public writeRequiresMasterRead: boolean;

	constructor(json: any = {}) {

		super(json);

		this.caseSensitive = toBoolean(json.caseSensitive);
		this.customDataType = json.customDataType || null;
		this.defaultValue = json.defaultValue || null;
		this.deleteConstraint = json.deleteConstraint || null;
		this.deprecated = toBoolean(json.deprecated);
		this.description = json.description || null;
		this.displayFormat = json.displayFormat || null;
		this.displayLocationInDecimal = toBoolean(json.displayLocationInDecimal);
		this.encrypted = toBoolean(json.encrypted);
		this.externalDeveloperName = json.externalDeveloperName || null;
		this.externalId = toBoolean(json.externalId);
		this.fieldManageability = json.fieldManageability || null;
		this.formula = json.formula || null;
		this.formulaTreatBlankAs = json.formulaTreatBlankAs || null;
		this.globalPicklist = json.globalPicklist || null;
		this.indexed = toBoolean(json.indexed);
		this.inlineHelpText = json.inlineHelpText || null;
		this.isFilteringDisabled = toBoolean(json.isFilteringDisabled);
		this.isNameField = toBoolean(json.isNameField);
		this.isSortingDisabled = toBoolean(json.isSortingDisabled);
		this.reparentableMasterDetail = toBoolean(json.reparentableMasterDetail);
		this.label = json.label || null;
		this.length = toNumber(json.length);
		this.lookupFilter = new LookupFilter(json.lookupFilter);
		this.populateExistingRows = toBoolean(json.populateExistingRows);
		this.precision = toNumber(json.precision);
		this.referenceTargetField = json.referenceTargetField || null;
		this.referenceTo = json.referenceTo || null;
		this.relationshipLabel = json.relationshipLabel || null;
		this.relationshipName = json.relationshipName || null;
		this.relationshipOrder = toNumber(json.relationshipOrder);
		this.required = toBoolean(json.required);
		this.scale = toNumber(json.scale);
		this.startingNumber = toNumber(json.startingNumber);
		this.stripMarkup = toBoolean(json.stripMarkup);
		this.summarizedField = json.summarizedField = null;
		this.summaryFilterItems = toArray(json.summaryFilterItems).map(x => new FilterItem(x));
		this.summaryForeignKey = json.summaryForeignKey || null;
		this.summaryOperation = json.summaryOperation || null;
		this.trackFeedHistory = toBoolean(json.trackFeedHistory);
		this.trackHistory = toBoolean(json.trackHistory);
		this.trackTrending = toBoolean(json.trackTrending);
		this.trueValueIndexed = toBoolean(json.trueValueIndexed);
		this.type = json.type || null;
		this.unique = toBoolean(json.unique);
	}
}
