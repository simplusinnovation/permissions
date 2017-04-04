import {Rule} from "./Rule";


import {_replaceParam} from "./utils";

export type PermissionArgs = { [key: string] : any };

export interface IPermission{
	name?: string;
	key : string;
	args?: PermissionArgs;
}

/**
 * Checks is a permission is verified by an other permission
 * @param base the permission that is required
 * @param toBeCompared the users permission
 */
export function verifyRuleWithPermission(rule: Rule, toBeCompared: IPermission): boolean {
	// base must be more specific than permission

	let a: string[] = rule.split("/");
	let comp: string[] = toBeCompared.key.split("/");
	
	if (a.length <  comp.length)
		return false;
	
	for(let i =0; i < comp.length; ++i) {
		// All rights
		if(comp[i] === "*")
			continue;
		// Parameter rights
		else if(comp[i][0] === ":"){
			let args = _replaceParam(comp[i], toBeCompared.args);
			if(!(args instanceof Array))
				args = [args];
			for(let p of args){
				if(p == a[i])
					return true;
			}
			return false;
		}
		// folder right
		else if(comp[i] !== a[i])
			return false;
	}
	return true;
}

/**
 * Verifies a rule with a set of permissions
 * @param rule The rule that has to be verified
 * @param permissions The array of permissions
 * @param compare the functions that compares them (use default in general cases)
 */
export function verifyRule(
	rule: Rule, 
	permissions: IPermission[], 
	compare: (p1: Rule, p2: IPermission) => boolean = verifyRuleWithPermission) : boolean {

	for( let p of permissions) {
		if ( compare(rule, p) )
			return true
	}

	return false;
}

/**
 * Verifies a rule with a set of permissions and a permissions arguments object that will overwrite the rules arguments
 * @param rule The rule that has to be verified
 * @param permissions The array of permissions
 * @param overwrite permissions arguments object that will overwrite the rules arguments
 * @param compare a comparison function
 */
export function verifyRuleOverload(
		rule: Rule, 
		permissions: IPermission[], 
		overwrite: PermissionArgs = {},
		compare: (p1: Rule, p2: IPermission) => boolean = verifyRuleWithPermission): boolean {
	for( let p of permissions) {
		if ( compare(rule, { key: p.key, args : (<any>Object).assign( p.args || {}, overwrite)}) )
			return true
	}
	return false;
}

export class PermissionManager{
	permissions: Map<string, IPermission> = new Map<string, IPermission>();
	
	addPermission(p: IPermission): void {
		this.permissions.set(p.key, p);
	}

	getPermission(key: string): IPermission {
		return this.permissions.get(key);
	}

	getPermissions(): IPermission[] {
		return [...this.permissions.values()];
	}

	buildPermissionTree() {
	}
}

export const permissionManager: PermissionManager = new PermissionManager();

/**
 * needed permition
 */
// "users/5/profile/view" // A view profile
// "users/9/profile/edit" // B edit profile

/**
 * User permission
 */
// "users/*" // A and B
// "users/*/profile/*" //A and B
// "users/*/profile/view" //A only
// "users/9/profile/view" //none
// "users/9/profile/edit" //B only
// "users/9/profile/edit/base" //none