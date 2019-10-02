import { DebugLevel } from '../../models/sobjects/DebugLevel';
import { IAbstractSobjectService } from './IAbstractSobjectService';

export interface IDebugLevelService extends IAbstractSobjectService {
	getDebugLevels(ids: string[], fieldsToQuery: string[]) : Promise<DebugLevel[]>;
}