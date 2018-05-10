import { Sobject } from '../sobjects/Sobject';

export class SearchResultDto {
	public shortId: string;
	public name: string;
	public sobject: Sobject;
}