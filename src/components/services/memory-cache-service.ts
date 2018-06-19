import * as path from 'path';
import * as fs from 'fs';
import { Component } from '@nestjs/common';
import { ICache } from '../../interfaces/ICache';
import { Debug } from '../../utilities/debug';

@Component()
export class MemoryCache implements ICache {

	private cache = new Map();
	private debug = new Debug('MemoryCache');

	async get<T>(key: string) : Promise<T> {

		try {

			const val = this.cache.get(key);
			if(val) return val as T;

			if(hasMock(key)) {
				return getMockData(key);
			}

			return val;

		} catch (error) {
			this.debug.error(`Error getting the key "${key}" from cache`, error);
			throw error;
		}

	}

	async set(key: string, value: any, ttl: number) : Promise<void> {
		try {
			this.cache.set(key, value);
			writeMockData(key, value);
			return;
		} catch (error) {
			this.debug.error(`Error setting key "${error}" in the cache`, error);
			throw error;
		}
	}
}

function isMock() : boolean {
	const debugMode = (process.env.DEBUG_MODE || '').toLowerCase().trim();
	return debugMode === 'localhost';
}

function getFullPath(key: string) : string {
	key = key.replace(/\:/g, '-');
	return path.join(__dirname, `../../data-examples/${key}.json`);
}

function hasMock(key: string) : boolean {

	if(!isMock()) return false;

	const fullPath = getFullPath(key);

	try {
		fs.accessSync(fullPath);
		return true;
	} catch(error) {
		return false;
	}
}

function getMockData(key: string) {
	const fullPath = getFullPath(key);
	return JSON.parse(fs.readFileSync(fullPath).toString());
}

function writeMockData(key: string, value: any) : void {
	if(!isMock()) return;
	const fullPath = getFullPath(key);
	fs.writeFileSync(fullPath, JSON.stringify(value));
}