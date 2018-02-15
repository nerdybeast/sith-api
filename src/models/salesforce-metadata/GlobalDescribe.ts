import { SobjectDescribeBase } from './SobjectDescribeBase';

export class GlobalDescribe {
	
	//Most likely will be "UTF-8"
	encoding: string;

	//Most likely will be 200
	maxBatchSize: number;

	sobjects: SobjectDescribeBase[];
}
