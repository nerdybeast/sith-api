import { ManageableStateEnum } from '../enums/ManageableStateEnum';
import moment from 'moment';

export class FileProperties {
	public createdById: string;
	public createdByName: string;
	public createdDate: moment.Moment;
	public fileName: string;
	public fullName: string;
	public id: string;
	public lastModifiedById: string;
	public lastModifiedByName: string;
	public lastModifiedDate: moment.Moment;
	public manageableState: ManageableStateEnum;
	public namespacePrefix: string;
	public type: string;

	constructor(json: any = {}) {
		this.createdById = json.createdById || null;
		this.createdByName = json.createdByName || null;
		this.createdDate = json.createdDate ? moment(json.createdDate) : null;
		this.fileName = json.fileName || null;
		this.fullName = json.fullName || null;
		this.id = json.id || null;
		this.lastModifiedById = json.lastModifiedById || null;
		this.lastModifiedByName = json.lastModifiedByName || null;
		this.lastModifiedDate = json.lastModifiedDate ? moment(json.lastModifiedDate) : null;
		this.manageableState = json.manageableState || null;
		this.namespacePrefix = json.namespacePrefix || null;
		this.type = json.type || null;
	}
}