var expect = require("chai").expect,
	should = require('chai').should(),
	assert = require("chai").assert;

var trip = require("../routes/map.js").trip;

describe("Trip", function() {
	var results = trip(506110, 1);
	
	it("should return an Object", function() {
		expect(typeof results).to.equal("object");
	});
	
	it("should return a valid GeoJSON object", function() {
		expect(results.type).to.equal("FeatureCollection");
		assert(Array.isArray(results.features));
	});
	
	it("sould return valid JSON", function(){
		console.log(results);
		console.log(results.features[0]);
		results.should.be.json;
	});
});