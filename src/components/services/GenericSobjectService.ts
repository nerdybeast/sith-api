import { AbstractSobjectService } from './AbstractSobjectService';
import { Connection } from '../../models/Connection';
import { ICache } from '../../interfaces/ICache';
import { IGenericSobjectService } from './IGenericSobjectService';
import { Sobject } from '../../models/sobjects/Sobject';

export class GenericSobjectService extends AbstractSobjectService<Sobject> implements IGenericSobjectService {

	constructor(sobjectName: string, connection: Connection, cache: ICache) {
		super(sobjectName, connection, cache);
	}

}