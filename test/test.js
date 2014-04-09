var expect = require('chai').expect,
	should = require('chai').should(),
	assert = require('chai').assert;


var trip = require("../routes/map.js").trip;

describe("Ruta API", function() {
	var results,
	stops;

	before(function(done) {
		trip("pavas", 6, function(data, num) {
			results = data;
			stops = num;
			done();
		});
	});

	it("Should return valid GeoJSON with a feature collection of stops", function() {
		expect(typeof results).to.equal("object");
		expect(results).to.have.a.property("type", "FeatureCollection");
		assert(Array.isArray(results.features));
		expect(results.features[0]).to.have.a.property("type", "Feature");
		expect(results.features[0]).to.have.a.property("properties");
		expect(results.features[0]).to.have.a.property("geometry");
		expect(results.features[0]).to.have.a.property("geometry");
		expect(results.features[0].geometry).to.have.a.property("coordinates");
		assert(Array.isArray(results.features[stops - 1].geometry.coordinates));
		results.should.be.json;
		expect(results.features.length).to.not.equal(0);
		expect(typeof results.features[0]).to.equal("object");
		console.log("Tiene " + stops + " paradas.");
		


	});

	it("Should throw an error if bad parameters are given", function() {
		expect(function() {
			trip("animal", "1");
			trip("456778", 9);
		}).to.throw();
	});

});