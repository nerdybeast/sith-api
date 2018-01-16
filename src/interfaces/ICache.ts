export interface ICache {
	get <T>(key: string) : Promise<T>;
	set(key: string, val: any, ttl: number) : Promise<void>;
}