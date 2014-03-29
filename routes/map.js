//maps routing, changes KML aacording to request



exports.map = function(req, res) {
	res.render('map', {
		title: 'Ruta'
	});
};

//GET - Return a trip object with the provided route id and trip number
exports.trip = function(route_id, trip_n) {

	var sqlite3 = require('sqlite3').verbose(),
		db = new sqlite3.Database('./db.db'),

		GEOJSON = {
			"type": "FeatureCollection",
			"features": [],

		},

		query = "SELECT * FROM stoptimes st INNER JOIN stops s ON  st.stop_id = s.stop_id AND route_id = " + route_id + " AND stoptime_trip = " + trip_n + ";";


	var sqlOutput = function() {
		db.serialize(function() {
			db.each(query, function(err, row) {
				console.log(row)
				GEOJSON.features.push(row);
			});
		});
	};
	sqlOutput();

	return GEOJSON;

};