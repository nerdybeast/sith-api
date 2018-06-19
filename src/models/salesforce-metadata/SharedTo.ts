import { toArray } from '../../utilities/Cast';

export class SharedTo {
	public allCustomerPortalUsers: string;
	public allInternalUsers: string;
	public allPartnerUsers: string;
	public channelProgramGroup: string;
	public channelProgramGroups: string[];
	public group: string[];
	public groups: string[];
	public managerSubordinates: string[];
	public managers: string[];
	public portalRole: string[];
	public portalRoleandSubordinates: string[];
	public role: string[];
	public roleAndSubordinates: string[];
	public roleAndSubordinatesInternal: string[];
	public roles: string[];
	public rolesAndSubordinates: string[];
	public territories: string[];
	public territoriesAndSubordinates: string[];
	public territory: string[];
	public territoryAndSubordinates: string[];
	public queue: string[];

	constructor(json: any = {}) {
		this.allCustomerPortalUsers = json.allCustomerPortalUsers || null;
		this.allInternalUsers = json.allInternalUsers || null;
		this.allPartnerUsers = json.allPartnerUsers || null;
		this.channelProgramGroup = json.channelProgramGroup || null;
		this.channelProgramGroups = toArray(json.channelProgramGroups).map(x => x);
		this.group = toArray(json.group).map(x => x);
		this.groups = toArray(json.groups).map(x => x);
		this.managerSubordinates = toArray(json.managerSubordinates).map(x => x);
		this.managers = toArray(json.managers).map(x => x);
		this.portalRole = toArray(json.portalRole).map(x => x);
		this.portalRoleandSubordinates = toArray(json.portalRoleandSubordinates).map(x => x);
		this.role = toArray(json.role).map(x => x);
		this.roleAndSubordinates = toArray(json.roleAndSubordinates).map(x => x);
		this.roleAndSubordinatesInternal = toArray(json.roleAndSubordinatesInternal).map(x => x);
		this.roles = toArray(json.roles).map(x => x);
		this.rolesAndSubordinates = toArray(json.rolesAndSubordinates).map(x => x);
		this.territories = toArray(json.territories).map(x => x);
		this.territoriesAndSubordinates = toArray(json.territoriesAndSubordinates).map(x => x);
		this.territory = toArray(json.territory).map(x => x);
		this.territoryAndSubordinates = toArray(json.territoriesAndSubordinates).map(x => x);
		this.queue = toArray(json.queue).map(x => x);
	}
}