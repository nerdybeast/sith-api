export function toBoolean(val: any, defaultValue: any = null) : boolean | any {
	if(!val) return null;
	if(typeof val === 'boolean') return val;
	return JSON.parse(val.toLowerCase());
}

export function toNumber(val: any, defaultValue: any = null) : number | any {
	if(!val) return null;
	if(typeof val === 'number') return val;
	return Number(val);
}