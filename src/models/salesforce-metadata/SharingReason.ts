import { Metadata } from './Metadata';

export class SharingReason extends Metadata {
	public label: string;

	constructor(json: any = {}) {
		super(json);
		this.label = json.label || null;
	}
}