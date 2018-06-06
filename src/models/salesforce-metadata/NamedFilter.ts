import { Metadata } from './Metadata';
import { FilterItems } from './FilterItems';

export class NamedFilter extends Metadata {
	public active: boolean;
	public booleanFilter: string;
	public description: string;
	public errorMessage: string;
	public field: string;
	public filterItems: FilterItems[];
	public infoMessage: string;
	public isOptional: boolean;
	public name: string;
	public sourceObject: string;
}