
//gets an array of stoptimes objects
//this is broke!!!!


var trips = require('../public/models/trips'),
	routes = require('../public/models/routes'),
	stoptimes= require('../public/models/stoptimes'),
	stops=require('../public/models/stops');


var getStopTimes = function(trip) {
var tripStops = [],
len = stoptimes.length,
t=trips.length;
console.log(trips.length);

for (var i = 0, x = tripStops.length,  l = len, found = false; i < l, x<t ; i++) {
	console.log(stoptimes[i].trip + "  " +trips[x].number)
if (stoptimes[i].trip == trips[x].number) {
found = true;
tripStops.push(stoptimes[i]);
}
}
if (found) {
//console.log(" this Trip is: " + stoptimes);
console.log(" Este viaje en tren tiene " + tripStops.length + " paradas");
//console.log(tripStops);
} else {
	console.log(tripStops.length);
console.log("no stops. trip # is: "+ trips[trip] );
}
};


getStopTimes(trips[1]);
