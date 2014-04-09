//maps routing, changes KML aacording to request
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db.db');


exports.map = function(req, res) {
	res.render('map', {
		title: 'Ruta'
	});
};

//GET - Return a trip object with the provided route id and trip number
exports.trip = function(route_name, trip_n, cb) {

	var route = route_name.toLowerCase();

switch (route)
{
case 'cartago':
  route= 506130;
  break;
case 'heredia':
  route= 506411;
  break;
case 'belen':
  route= 506410;
  break;
case 'pavas':
  route= 506110;
  break;
default:
  route='Looking forward to the Weekend';
}

	if (isNaN(route) || isNaN(trip_n)) {
		var e = new Error('Route or trip must be number');
		cb(e);
	}
	var jsonresult = (function() {
		var query = "SELECT r.route_name route,st.route_id route_id, st.stoptime_stop_sequence seq, st.stoptime_id, s.stop_id, s.stop_name stop, st.stoptime_headsign goes_to,st.stoptime_arrival_time arrival, st.stoptime_departure_time departure, s.stop_lat latitude, s.stop_lon longitude  FROM stoptimes st  INNER JOIN stops s ON st.stop_id = s.stop_id   AND  st.route_id =" + route+ " AND stoptime_trip = " + trip_n + " INNER JOIN routes r ON r.route_id = st.route_id;";


		db.serialize(function() {
			var GEOJSON = {
				"type": "FeatureCollection",
				"features": []
			};

			db.each(query, function(err, row) {
				var stop = {};
				if (err) {
					console.log(err);
				} else {
					stop.type = "Feature";
					stop.geometry = {};
					stop.properties = {};
					stop.properties.stop_sequence = row.seq;
					stop.properties.route = row.route;
					stop.properties.route_id = row.route_id;
					stop.properties.stop_name = row.stop;
					stop.properties.destiny = row.goes_to;
					stop.properties.arrival = row.arrival;
					stop.properties.departure = row.departure;
					stop.geometry.type = "Point";
					stop.geometry.coordinates = [row.longitude, row.latitude];
					GEOJSON.features.push(stop);
				}

			}, function(err, rows) {
				var e = new Error("Error: invalid route or trip number ");

				if (GEOJSON.features.length === 0) {
					cb(e);
				} else {
					cb(GEOJSON, rows);
				}
			});

		});
	})();

};