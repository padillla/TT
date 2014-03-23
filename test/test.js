var expect = require("chai").expect;
var assert = require("chai").assert;
 
var trip = require("../routes/map.js").trip;

describe("Trip", function() {
	it("Should return an Object", function(){
		var results = trip(506410, 1);
		expect(typeof results).to.equal("object");
	});
	it("should return a valid GeoJSON object", function(){
		var results = trip(506410, 1);
		expect(results.type).to.equal("FeatureCollection");
		assert(Array.isArray(results.features));
	})
});