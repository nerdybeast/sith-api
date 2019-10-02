import { AbstractSobjectService } from './AbstractSobjectService';
import { Connection } from '../../models/Connection';
import { ICache } from '../../interfaces/ICache';
import { IGenericSobjectService } from './IGenericSobjectService';

export class GenericSobjectService extends AbstractSobjectService implements IGenericSobjectService {

	constructor(sobjectName: string, connection: Connection, cache: ICache) {
		super(sobjectName, connection, cache);
	}

}