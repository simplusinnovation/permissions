const assert = require("assert");
const Role = require("../build/Role");
const Permission = require("../build/Permission");

describe("Roles", function(){
	describe("Role manager", function(){
		const manager = new Role.RoleManager();
		manager.bindPermission("USER", { key : "users/*"});
		manager.bindPermission("USER1", { key : "users/*/read"});
		manager.bindPermission("USER1", { key : "users/*/write"});

		it("Verify perimissions for role", function(){
			assert.ok(manager.verify("USER", "users/5/read"));
			assert.ok(manager.verify("USER", "users/6/write"));
			assert.ok(manager.verify("USER", "users/6/read"));
			assert.ok(!manager.verify("USER", "tests/6/write"));
			assert.ok(!manager.verify("USER1", "users/read"));
			assert.ok(manager.verify("USER1", "users/6/write"));
			assert.ok(manager.verify("USER1", "users/6/read"));
		});

		it("Verify permission for root", function(){
			assert.ok(Role.roleManager.verify(Role.USER_ROLES.ROOT, "users/5/read"));
			assert.ok(Role.roleManager.verify(Role.USER_ROLES.ROOT, "users/6/write"));
			assert.ok(Role.roleManager.verify(Role.USER_ROLES.ROOT, "users/6/read"));
		});

		it("Verify permission for public default", function(){
			assert.ok(!Role.roleManager.verify(Role.USER_ROLES.PUBLIC, "users/5/read"));
			assert.ok(!Role.roleManager.verify(Role.USER_ROLES.PUBLIC, "users/6/write"));
			assert.ok(!Role.roleManager.verify(Role.USER_ROLES.PUBLIC, "users/6/read"));
		});

		it("Verify permission for public modified", function(){
			Role.roleManager.bindPermission(Role.USER_ROLES.PUBLIC, { key : "test/*"});
			assert.ok(Role.roleManager.verify(Role.USER_ROLES.PUBLIC, "test/5/read"));
			assert.ok(Role.roleManager.verify(Role.USER_ROLES.PUBLIC, "test/6/write"));
			assert.ok(!Role.roleManager.verify(Role.USER_ROLES.PUBLIC, "users/6/read"));
		});
	});
});