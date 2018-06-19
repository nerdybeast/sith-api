import { Metadata } from './Metadata';

export class CompactLayout extends Metadata {
	public fields: string;
	public label: string;

	constructor(json: any = {}) {
		super(json);
		this.fields = json.fields || null;
		this.label = json.label || null;
	}
}