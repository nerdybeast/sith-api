import { AbstractSobjectService } from './AbstractSobjectService';
import { Connection } from '../../models/Connection';
import { ICache } from '../../interfaces/ICache';
import { IGenericSobjectService } from './IGenericSobjectService';
import { Sobject } from '../../models/sobjects/Sobject';
import { DebugFactory } from '../../third-party-modules/debug/DebugFactory';

export class GenericSobjectService extends AbstractSobjectService<Sobject> implements IGenericSobjectService {

	constructor(sobjectName: string, connection: Connection, cache: ICache, debugFactory: DebugFactory) {
		super(sobjectName, connection, cache, debugFactory);
	}

}