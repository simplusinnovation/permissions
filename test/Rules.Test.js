const mocha = require("mocha");
const assert = require("assert");
const Rules = require("../build/Rule");

describe("Rules", function(){
	it("build rules", function(){
		assert.equal(Rules.buildRule("test/:id/read", { id : 5}), "test/5/read");
		assert.notEqual(Rules.buildRule("test/:id/read", { id : 2}), "test/5/read");
	});
})