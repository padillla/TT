
//gets an array of stoptimes objects
//this is broke!!!!
/*var stoptimes ={
        
        "id    ": 50641112,
        "train_type": "Apolo",
        "trip": 1,
        "stop_sequence": 2,
        "headsign": "San José Atlántico",
        "arrival_time": "06:05",
        "departure_time": "06:05",
        "route_id": 506411,
        "stop_id": 409020
    };
*/
var trips = require('../public/models/trips'),
	routes = require('../public/models/routes'),
	stoptimes= require('../public/models/stoptimes'),
	stops=require('../public/models/stops');


var getStopTimes = function(trip) {
var tripStops = [],
len = stoptimes.length,

console.log(trips.length);
found = false;

var  filterStoptimes  =   function(stoptime, trip){
    var  found = false;
    if (stoptime.trip===trip.number){
    found=true;
    }
    else {
    console.log("no stops. trip # is: "+ trips[trip] );
    }

 };  
 
var getStopTimes  = function( trip ) {
    var  l =  trip.length;
    for (var i = 0; i < len; i++) {
    for( var j=0; j<l; j++ ) {
        filterStoptimes(stoptimes[i], trip[j]);
        if (found){
            tripStops.push(stoptimes[i]};
        }
    }
    return tripStops;
}

console.log(getStopTimes(trips[1]));
