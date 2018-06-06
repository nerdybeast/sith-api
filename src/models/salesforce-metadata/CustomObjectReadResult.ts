import { Metadata } from './Metadata';
import { BusinessProcess } from './BusinessProcess';
import { CompactLayout } from './CompactLayout';
import { DeploymentStatus } from '../enums/DeploymentStatus';
import { PlatformEventType } from '../enums/PlatformEventType';
import { SharingModel } from '../enums/SharingModel';
import { CustomField } from './CustomField';
import { FieldSet } from './FieldSet';
import { Gender } from '../enums/Gender';
import { HistoryRetentionPolicy } from './HistoryRetentionPolicy';
import { Index } from './Index';
import { ListView } from './ListView';
import { NamedFilter } from './NamedFilter';
import { RecordType } from './RecordType';
import { SearchLayouts } from './SearchLayouts';
import { SharingReason } from './SharingReason';
import { SharingRecalculation } from './SharingRecalculation';
import { StartsWith } from '../enums/StartsWith';
import { ValidationRule } from './ValidationRule';
import { SetupObjectVisibility } from '../enums/SetupObjectVisibility';
import { WebLink } from './WebLink';
import { MetadataActionOverride } from './MetadataActionOverride';
import { toBoolean } from '../../utilities/Cast';

export class CustomObjectReadResult extends Metadata {
	public actionOverrides: MetadataActionOverride[];
	public allowInChatterGroups: boolean;
	public businessProcesses: BusinessProcess[];
	public compactLayoutAssignment: string;
	public compactLayouts: CompactLayout[];
	public customHelp: string;
	public customHelpPage: string;
	public deploymentStatus: DeploymentStatus;
	public deprecated: boolean;
	public description: string;
	public enableActivities: boolean;
	public enableBulkApi: boolean;
	public enableChangeDataCapture: boolean;
	public enableDivisions: boolean;
	public enableEnhancedLookup: boolean;
	public enableFeeds: boolean;
	public enableHistory: boolean;
	public enableReports: boolean;
	public enableSearch: boolean;
	public enableSharing: boolean;
	public enableStreamingApi: boolean;
	public eventType: PlatformEventType;
	public externalDataSource: string;
	public externalName: string;
	public externalRepository: string;
	public externalSharingModel: SharingModel;
	public fields: CustomField[];
	public fieldSets: FieldSet;
	public gender: Gender;
	public household: boolean;
	public historyRetentionPolicy: HistoryRetentionPolicy;
	public indexes: Index[];
	public label: string;
	public listViews: ListView[];
	public namedFilter: NamedFilter[];
	public nameField: CustomField;
	public pluralLabel: string;
	public recordTypes: RecordType[];
	public recordTypeTrackFeedHistory: boolean;
	public recordTypeTrackHistory: boolean;
	public searchLayouts: SearchLayouts;
	public sharingModel: SharingModel;
	public sharingReasons: SharingReason[];
	public sharingRecalculations: SharingRecalculation[];
	public startsWith: StartsWith;
	public validationRules: ValidationRule[];
	public visibility: SetupObjectVisibility;
	public webLinks: WebLink[];

	constructor(rawJson: any = {}) {

		super(rawJson);

		this.actionOverrides = (rawJson.actionOverrides || []).map(x => new MetadataActionOverride(x));
		this.allowInChatterGroups = toBoolean(rawJson.allowInChatterGroups);
		this.businessProcesses = (rawJson.businessProcesses || []).map(x => new BusinessProcess(x));

		this.fields = (rawJson.fields || []).map(x => new CustomField(x));
	}
}
