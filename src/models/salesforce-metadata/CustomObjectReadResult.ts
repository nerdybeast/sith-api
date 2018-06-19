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
import { toBoolean, toArray } from '../../utilities/Cast';

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

	constructor(json: any = {}) {

		super(json);

		this.actionOverrides = toArray(json.actionOverrides).map(x => new MetadataActionOverride(x));
		this.allowInChatterGroups = toBoolean(json.allowInChatterGroups);
		this.businessProcesses = toArray(json.businessProcesses).map(x => new BusinessProcess(x));
		this.compactLayoutAssignment = json.compactLayoutAssignment || null;
		this.compactLayouts = toArray(json.compactLayouts).map(x => new CompactLayout(x));
		this.customHelp = json.customHelp || null;
		this.customHelpPage = json.customHelpPage || null;
		this.deploymentStatus = json.deploymentStatus || null;
		this.deprecated = toBoolean(json.deprecated);
		this.description = json.description || null;
		this.enableActivities = toBoolean(json.enableActivities);
		this.enableBulkApi = toBoolean(json.enableBulkApi);
		this.enableChangeDataCapture = toBoolean(json.enableChangeDataCapture);
		this.enableDivisions = toBoolean(json.enableDivisions);
		this.enableEnhancedLookup = toBoolean(json.enableEnhancedLookup);
		this.enableFeeds = toBoolean(json.enableFeeds);
		this.enableHistory = toBoolean(json.enableHistory);
		this.enableReports = toBoolean(json.enableReports);
		this.enableSearch = toBoolean(json.enableSearch);
		this.enableSharing = toBoolean(json.enableSharing);
		this.enableStreamingApi = toBoolean(json.enableStreamingApi);
		this.eventType = json.eventType || null;
		this.externalDataSource = json.externalDataSource || null;
		this.externalName = json.externalName || null;
		this.externalRepository = json.externalRepository || null;
		this.externalSharingModel = json.externalSharingModel || null;
		this.fields = toArray(json.fields).map(x => new CustomField(x));
		this.fieldSets = new FieldSet(json.fieldSets);
		this.gender = json.gender || null;
		this.household = toBoolean(json.household);
		this.historyRetentionPolicy = new HistoryRetentionPolicy(json.historyRetentionPolicy);
		this.indexes = toArray(json.indexes).map(x => new Index(x));
		this.label = json.label = json.label || null;
		this.listViews = toArray(json.listViews).map(x => new ListView(x));
		// this.namedFilter = json.xxx
		// this.nameField = json.xxx
		// this.pluralLabel = json.xxx
		// this.recordTypes = json.xxx
		// this.recordTypeTrackFeedHistory = json.xxx
		// this.recordTypeTrackHistory = json.xxx
		// this.searchLayouts = json.xxx
		// this.sharingModel = json.xxx
		// this.sharingReasons = json.xxx
		// this.sharingRecalculations = json.xxx
		// this.startsWith = json.xxx
		// this.validationRules = json.xxx
		// this.visibility = json.xxx
		// this.webLinks = json.xxx
	}
}
