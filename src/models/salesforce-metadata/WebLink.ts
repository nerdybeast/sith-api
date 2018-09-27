import { Metadata } from './Metadata';
import { WebLinkAvailability } from '../enums/WebLinkAvailability';
import { WebLinkDisplayType } from '../enums/WebLinkDisplayType';
import { Encoding } from '../enums/Encoding';
import { WebLinkType } from '../enums/WebLinkType';
import { WebLinkWindowType } from '../enums/WebLinkWindowType';
import { WebLinkPosition } from '../enums/WebLinkPosition';
import { toNumber, toBoolean } from '../../utilities/Cast';

export class WebLink extends Metadata {
	public availability: WebLinkAvailability;
	public description: string;
	public displayType: WebLinkDisplayType;
	public encodingKey: Encoding;
	public hasMenubar: boolean;
	public hasScrollbars: boolean;
	public hasToolbar: boolean;
	public height: number;
	public isResizable: boolean;
	public linkType: WebLinkType;
	public masterLabel: string;
	public openType: WebLinkWindowType;
	public page: string;
	public position: WebLinkPosition;
	public protected: boolean;
	public requireRowSelection: boolean;
	public scontrol: string;
	public showsLocation: boolean;
	public showsStatus: boolean;
	public url: string;
	public width: number;

	constructor(json: any = {}) {

		super(json);

		this.availability = json.availability || null;
		this.description = json.description || null;
		this.displayType = json.displayType || null;
		this.encodingKey = json.encodingKey || null;
		this.hasMenubar = toBoolean(json.hasMenubar);
		this.hasScrollbars = toBoolean(json.hasScrollbars);
		this.hasToolbar = toBoolean(json.hasToolbar);
		this.height = toNumber(json.height);
		this.isResizable = toBoolean(json.isResizable);
		this.linkType = json.linkType || null;
		this.masterLabel = json.masterLabel || null;
		this.openType = json.openType || null;
		this.page = json.page || null;
		this.position = json.position || null;
		this.protected = toBoolean(json.protected);
		this.requireRowSelection = toBoolean(json.requireRowSelection);
		this.scontrol = json.scontrol || null;
		this.showsLocation = toBoolean(json.showsLocation);
		this.showsStatus = toBoolean(json.showsStatus);
		this.url = json.url || null;
		this.width = toNumber(json.width);
	}
}