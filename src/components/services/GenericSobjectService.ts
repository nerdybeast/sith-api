import { AbstractSobjectService } from './AbstractSobjectService';
import { Connection } from '../../models/Connection';

export class GenericSobjectService extends AbstractSobjectService {

	constructor(sobjectName: string, connection: Connection) {
		super(sobjectName, connection);
	}

}