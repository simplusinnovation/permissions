#Permission management system
This packages allows to create permissions and verify rules in an intuitive manner

##Install

Open your terminal and install it with npm

```
npm install @simplus/permissions
```

##Usage
Include rules in your node project using:
```javascript
const permissions = require("@simplus/permissions");
```

Or using typescript/es6
```typescript
import {...} from "@simplus/permissions";
```

### Rules

A rule is basically a string represented as a path

*ex*:
```typescript
let rule1 = "users/5/profile/view";
let rule2 = "users/5/profile/edit";
let rule3 = "users/5/profile/view_details";
```

### Permission

A permission can verify or not a rule, it contains an optional name, a key, and optional args

*ex*:
```typescript
let permission1 = {name : "All permissions on users", key : "users/*"};
let permission2 = {name : "Edit profile of user {5}", key : "users/:uid/profile/edit", args : {uid : 5}};
let permission3 = {name : "View profile of users {5,6,7}", key : "users/:uid/profile/view", args : {uid : [5,6,7]}};
let permission4 = {name : "View profile of users {5,6,7}", key : "users/:uid/profile/view", args : {uid : [5,6,7]}};
let permission4 = {name : "View profile of user 5", key : "users/5/profile/view"};
```

**Permission name**
name is a description for the permission rule

**Permission key**
the key is like a rule but with more generic parameters, it is represented by a path where every "folder" can be :
 - \* : every value
 - :{param} : an element that can take several values (see Permission args), {param} will be replaced by the args
 - a string

**Permission args**
 args is a key to value object where:
 - key : is a string that apprears in the Permission key preceded by a column (:)
 - value : can be from any type (convertible into a string) or an array to represent a duplication of the rule for all these elements


 ### Verify a rule by a permission

 In order to check if a rule is verified by a permission you need to use the verifyRuleWithPermission function

 *ex*:
 ```typescript
 import {verifyRuleWithPermission} from "@simplus/permissions";
 
 if(verifyRuleWithPermission("products/5/edit", {key : "products/:product_id/edit", {product_id : 5}})){
	 console.log("allowed");
 }else{
	 console.log("not allowed");
 }
 ```

 ### Verify a rule by a set of permissions
You can also verify a rule by passing multiple permissions

 *ex*:
 ```typescript
 import {verifyRule} from "@simplus/permissions";
 
 if(verifyRule("products/5/edit", [
		{key : "products/:product_id/edit", {product_id : [5,6,8]}},
		{key : "products/:product_id/view", {product_id : 5}},
		{key : "products/*/delete"},
	 ])){
	 console.log("allowed");
 }else{
	 console.log("not allowed");
 }
 ```
### Verify a rule by overloading permissions args
In some cases you may want to overload some of the permissions args

*ex*:
 ```typescript
 import {verifyRule} from "@simplus/permissions";
 
 if(verifyRuleOverload("product/5/edit", [
		{key : ":catagory/_/edit", {product_id : [5,6,8]}},
		{key : ":catagory/:product_id/view", {product_id : 5}},
		{key : ":catagory/*/delete"},
	 ], {
		 category : "product"
	 })){
	 console.log("allowed");
 }else{
	 console.log("not allowed");
 }
 ```

 ### Roles

 Roles are a set of rules ...