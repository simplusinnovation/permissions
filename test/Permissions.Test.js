const mocha = require("mocha");
const assert = require("assert");
const Permission = require("../build/Permission");

describe("Permissions", function(){
	describe("PermissionManager",function(){
		let manager = new Permission.PermissionManager();
		let a = [{key : "tests/write"}, {key : "tests/read"}, {key : "tests/execute"}];

		manager.addPermission(a[0]);
		manager.addPermission(a[1]);
		manager.addPermission(a[2]);

		it("add and get rules", function(){
			assert.deepStrictEqual(manager.getPermission("tests/write"), a[0], "Check add/get");
			assert.deepStrictEqual(manager.getPermission("tests/read"), a[1], "Check add/get");
			assert.deepStrictEqual(manager.getPermission("tests/re"), undefined, "Ceck get on not existing");
		})

		it("get all permissions", function(){
			assert.deepStrictEqual(manager.getPermissions(), a, "Get all");
			assert.equal(manager.getPermissions().length, a.length, "Get all");
		});
	});

	describe("Rule verification", function(){
		let rules = [
			"tests/write",
			"tests/read",
			"tests/a/execute",
			"tests/b/execute",
			"tests/c/read",
			"something/write"
		];

		let permissions = [
			{key : "tests/write"},
			{key : "tests/read"},
			{key : "tests/a/execute"},
			{key : "tests/b/execute"},
			{key : "tests/c/read"},
			{key : "something/write"},
			{key : "tests/*"},
			{key : "tests/*/execute"},
		];

		it("verify simple rules", function(){
			assert.ok(Permission.verifyRuleWithPermission("tests/write", permissions[0]));
			assert.ok(Permission.verifyRuleWithPermission("tests/read", permissions[1]));
			assert.ok(!Permission.verifyRuleWithPermission("tests/reqd", permissions[1]));
			assert.ok(!Permission.verifyRuleWithPermission("tests", permissions[1]));
		});

		it("verify generalized rules", function(){
			assert.ok(Permission.verifyRuleWithPermission(rules[0], permissions[6]), "generalize 1");
			assert.ok(Permission.verifyRuleWithPermission(rules[1], permissions[6] ), "generalize 2");
			assert.ok(Permission.verifyRuleWithPermission(rules[2], permissions[6] ), "generalize 3");
			assert.ok(!Permission.verifyRuleWithPermission(rules[5], permissions[6] ), "generalize on wrong scope");

			assert.ok(!Permission.verifyRuleWithPermission(rules[0], permissions[7] ), "permission longer than rule");
			assert.ok(Permission.verifyRuleWithPermission(rules[2], permissions[7] ), "generalize in the middle 1");
			assert.ok(Permission.verifyRuleWithPermission(rules[3], permissions[7] ), "generalize in the middle 2");
			assert.ok(!Permission.verifyRuleWithPermission(rules[4], permissions[7] ), "generalize in the middle wrong element");
		});

		it("verify parametre rules", function(){
			assert.ok(Permission.verifyRuleWithPermission("test/a/read", { key : "test/:bonjour/read", args : { bonjour : "a"}}), "parameter 1");
			assert.ok(!Permission.verifyRuleWithPermission("test/b/read", { key : "test/:bonjour/read", args : { bonjour : "a"}}), "parameter wrong");
			assert.ok(Permission.verifyRuleWithPermission("test/a/read", { key : "test/:bonjour/read", args : { bonjour : ["a", "b"]}}), "parameter with array 1");
			assert.ok(Permission.verifyRuleWithPermission("test/b/read", { key : "test/:bonjour/read", args : { bonjour : ["a", "b"]}}), "parameter with array 2");
			assert.ok(!Permission.verifyRuleWithPermission("test/c/read", { key : "test/:bonjour/read", args : { bonjour : ["a", "b"]}}), "parameter with array wrong");
			assert.ok(Permission.verifyRuleWithPermission("test/0/read", { key : "test/:bonjour/read", args : { bonjour : 0}}), "with number");
			assert.ok(Permission.verifyRuleWithPermission("test/0/read", { key : "test/:bonjour/read", args : { bonjour : [0, 1]}}), "with number in array");
		});

		it("verify multiple from permissions", function(){
			assert.ok(Permission.verifyRule("users/tests", [{ key : "hello"}, { key : "*"}]));
			assert.ok(!Permission.verifyRule("users/tests", [{ key : "hello"}]));
		})
	})

	describe("Rule verification with overwrite", function(){
		it("verify rules", function(){
			let overwrite = { uid : 5 };

			assert.ok(Permission.verifyRuleOverload("users/5/read", [{ key : "users/:uid/*", args: { uid: 8}}], overwrite))
			assert.ok(!Permission.verifyRuleOverload("users/5/read", [{ key : "users/:id/*", args: { id: 8}}], overwrite))
		});
	});

	
});