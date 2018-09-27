import { Metadata } from './Metadata';
import { toBoolean } from '../../utilities/Cast';

export class ValidationRule extends Metadata {
	public active: boolean;
	public description: string;
	public errorConditionFormula: string;
	public errorDisplayField: string;
	public errorMessage: string;

	constructor(json: any = {}) {
		super(json);
		this.active = toBoolean(json.active);
		this.description = json.description || null;
		this.errorConditionFormula = json.errorConditionFormula || null;
		this.errorDisplayField = json.errorDisplayField || null;
		this.errorMessage = json.errorMessage || null;
	}
}