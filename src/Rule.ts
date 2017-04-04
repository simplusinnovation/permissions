export type Rule = string;

import {_replaceParam} from "./utils";

/**
 * Build a rule with parameters
 * @param rule a string with optional params (users/:param1/:param2/view)
 * @param params an object wher key are the params keys and values are the values that have to be replaced
 */
export function buildRule(rule: Rule, params: { [key: string] : any} ) {
	let r = rule.split("/");

	return r.map( p => {
		if (p[0] === ":")
			return _replaceParam(p, params);
		return p;
	}).join("/");
}