import { isArray } from 'util';

export function toBoolean(val: any) : boolean | any {
	if(!val) return null;
	if(typeof val === 'boolean') return val;
	return JSON.parse(val.toLowerCase());
}

export function toNumber(val: any) : number | any {
	if(!val) return null;
	if(typeof val === 'number') return val;
	return Number(val);
}

export function toArray(val: any) : any[] {

	val = val || [];

	if(!isArray(val)) {
		val = [val];
	}

	return val;
}