//maps routing, changes KML aacording to request

exports.map = function(req, res) {
	res.render('map', {
		title: 'Ruta'
	});
};

//GET - Return a trip object with the provided route id and trip number
exports.trip = function(route_id, trip_n) {
	var trip = {
		"type": "FeatureCollection",
		"features": []
	};


	return trip;
};