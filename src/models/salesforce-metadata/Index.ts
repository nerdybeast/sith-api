import { Metadata } from './Metadata';
import { IndexField } from './IndexField';
import { toArray } from '../../utilities/Cast';

export class Index extends Metadata {
	fields: IndexField[];
	constructor(json: any = {}) {
		super(json);
		this.fields = toArray(json.fields).map(x => new IndexField(x));
	}
}