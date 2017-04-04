import {IPermission, verifyRule} from "./Permission";
import {Rule} from "./Rule";

export type Role = string;

const ROOT: string = "root";
const PUBLIC: string = "public";

export const USER_ROLES = {ROOT, PUBLIC};

/**
 * Manage roles and links roles to permissions
 */
export class RoleManager {
	roles: Map<Role, IPermission[]> = new Map<Role, IPermission[]>();
	
	bindPermission(role: Role, permission: IPermission) {
		if(!this.roles.has(role))
			this.roles.set(role, []);
		this.roles.get(role).push(permission);
	}

	verify(role: Role, rule: Rule) {
		if(this.roles.has(role))
			return verifyRule(rule, this.roles.get(role))
		return false;
	}

	getPermissions(role: Role): IPermission[] {
		if(this.roles.has(role))
			return this.roles.get(role);
		return [];
	}
}

export const roleManager: RoleManager = new RoleManager();

roleManager.bindPermission(USER_ROLES.ROOT, { name : "Root permissions", key : "*"})