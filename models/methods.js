//This  manipulate the model to be readable on the map 
// WIP
//TODO: Set markers on map for each trip.
//      Use the time and dates on stoptimes.

//defined models
var trips = require('../public/models/trips'),
	routes = require('../public/models/routes'),
	stoptimes= require('../public/models/stoptimes'),
	stops = require('../public/models/stops'),
	prettyjson = require("prettyjson");

//This array keeps stores the stoptimes objects for the current trip
var tripStops = [],
found = false;

//Filter stoptimes and give found a true when its trip property  match tthe trip number given
var  filterStoptimes  =   function(stoptime, trip){
    var l =trips.length,
    j;
    found = false;
    for ( j=0; j<l; j++ ) {
         if (stoptime.trip===trip){
            found = true;
         }
    }
 
 };
 
 //Push each stoptime matching the trip to tripStops array
 //receives a trip number as an argument
 
var getStopTimes  = function( trip ) {
    var i,
    len = stoptimes.length;
    for (i = 0; i < len; i++) {
         var current = stoptimes[i];
         filterStoptimes(current, trip);
         if (found){
            tripStops.push(current);
              }
         }
};
getStopTimes(1);
console.log(prettyjson.render(tripStops));
console.log( "This route has : " + tripStops.length+ " Stops");



