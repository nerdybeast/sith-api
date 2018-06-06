import { Metadata } from './Metadata';
import { WebLinkAvailability } from '../enums/WebLinkAvailability';
import { WebLinkDisplayType } from '../enums/WebLinkDisplayType';
import { Encoding } from '../enums/Encoding';
import { WebLinkType } from '../enums/WebLinkType';
import { WebLinkWindowType } from '../enums/WebLinkWindowType';
import { WebLinkPosition } from '../enums/WebLinkPosition';

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
}