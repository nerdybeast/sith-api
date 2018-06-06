import { Metadata } from './Metadata';

export class ValidationRule extends Metadata {
	public active: boolean;
	public description: string;
	public errorConditionFormula: string;
	public errorDisplayField: string;
	public errorMessage: string;
}