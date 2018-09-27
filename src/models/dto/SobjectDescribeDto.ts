import { SobjectField } from '../salesforce-metadata/SobjectField';
import { ActionOverride } from '../salesforce-metadata/ActionOverride';
import { MetadataActionOverride } from '../salesforce-metadata/MetadataActionOverride';
import { CustomField } from '../salesforce-metadata/CustomField';
import { FieldType } from '../enums/FieldType';

export class SobjectDescribeDto {
	public name: string;
	public actionOverrides: ActionOverrideDto[];
	public fields: FieldDto[];
	public recordTypes: RecordTypeDto[];
}

export class ActionOverrideDto {
	public sobjectActionOverride: ActionOverride;
	public metadataActionOverride: MetadataActionOverride;
}

export class FieldDto extends SobjectField {

	public metadata: CustomField;

	constructor(sobjectField?: SobjectField, customField?: CustomField) {

		super(sobjectField);

		//Not all fields come back in the metadata read (describe) call so we're going to "fix" some fields here.
		this.metadata = customField || new CustomField();
		this.metadata.type = this.metadata.type || translateFieldType(this.type);
	}
}

export class RecordTypeDto {
	public isAvailable: boolean = null;
	public isActive: boolean = null;
	public isDefault: boolean = null;
	public isMaster: boolean = null;
	public id: string = null;
	public name: string = null;
	public developerName: string = null;
	public description: string = null;
}

/**
 * These are the api field data types.
 * https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_enum_Schema_DisplayType.htm
 */
export enum DisplayTypeEnum {
	ADDRESS = 'address',
	BASE_64 = 'base64',
	BOOLEAN = 'boolean',
	COMBO_BOX = 'combobox',
	CURRENCY = 'currency',
	DATA_CATEGORY_GROUP_REFERENCE = 'datacategorygroupreference',
	DATE = 'date',
	DATE_TIME = 'datetime',
	DOUBLE = 'double',
	EMAIL = 'email',
	ENCRYPTED_STRING = 'encryptedstring',
	ID = 'id',
	INTEGER = 'integer',
	INTEGER_ABBREVIATED = 'int',
	MULTI_PICKLIST = 'multipicklist',
	PERCENT = 'percent',
	PHONE = 'phone',
	PICKLIST = 'picklist',
	REFERENCE = 'reference',
	STRING = 'string',
	TEXT_AREA = 'textarea',
	TIME = 'time',
	URL = 'url'
}

/**
 * Not all fields in the custom object metadata describe call come back that exsist on a custom object. For this reason
 * we can try and guess as to what the Salesforce data type is as opposed to the api data type.
 * @param sobjectFieldType the type as returned in the sobject-describe call, not the metadata-describe
 */
function translateFieldType(sobjectFieldType: string) : FieldType {

	switch(sobjectFieldType) {

		case DisplayTypeEnum.ADDRESS:
			return FieldType.Address;

		case DisplayTypeEnum.BOOLEAN:
			return FieldType.Checkbox;

		case DisplayTypeEnum.CURRENCY:
			return FieldType.Currency;

		case DisplayTypeEnum.DATE:
			return FieldType.Date;

		case DisplayTypeEnum.DATE_TIME:
			return FieldType.DateTime;

		case DisplayTypeEnum.EMAIL:
			return FieldType.Email;

		case DisplayTypeEnum.ID:
			return FieldType.Id;

		case DisplayTypeEnum.REFERENCE:
			return FieldType.Lookup;

		case DisplayTypeEnum.INTEGER:
		case DisplayTypeEnum.INTEGER_ABBREVIATED:
		case DisplayTypeEnum.DOUBLE:
			return FieldType.Number;

		case DisplayTypeEnum.PERCENT:
			return FieldType.Percent;

		case DisplayTypeEnum.PHONE:
			return FieldType.Phone;

		case DisplayTypeEnum.PICKLIST:
			return FieldType.Picklist;

		case DisplayTypeEnum.TEXT_AREA:
			return FieldType.TextArea;

		case DisplayTypeEnum.TIME:
			return FieldType.Time;

		case DisplayTypeEnum.URL:
			return FieldType.Url;

		default:
			return FieldType.Text;
	}

}
