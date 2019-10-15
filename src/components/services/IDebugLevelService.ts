import { DebugLevel } from '../../models/sobjects/DebugLevel';
import { IAbstractSobjectService } from './IAbstractSobjectService';

export interface IDebugLevelService extends IAbstractSobjectService<DebugLevel> {
	getDebugLevels(ids: string[], fieldsToQuery: string[]) : Promise<DebugLevel[]>;
}