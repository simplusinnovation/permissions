/**
 * replace a param by its value
 * @param param The param (ex: ":myparam")
 * @param params The key to value object (ex : { myparam : "value"})
 */
export function _replaceParam(param: string, params: { [key: string] : any } ) {
	return params[param.substr(1)];
}