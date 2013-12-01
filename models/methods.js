//This  manipulate the model to be readable on the map 
// WIP
//TODO: Set markers on map for each trip.
//      Use the time and dates on stoptimes.
//this is the playgrond, once a function do what its supposed to do, I'll throw it in map.js

//Doesnt run on the main page . This is needed just for node.js ugly testing

var trips = require('../public/models/trips'),
    routes = require('../public/models/routes'),
    stoptimes = require('../public/models/stoptimes'),
    stops = require('../public/models/stops'),
    prettyjson = require("prettyjson");

//This array stores the stoptimes objects for the current trip

var TREN = {

    stops: [],
    found: false,

    //Filter stoptimes and give found a true when its trip property  match the trip number given
    filterStoptimes: function(stoptime, trip) {
        var l = trips.length,
            j;
        this.found = false;
        for (j = 0; j < l; j++) {
            if (stoptime.trip === trip) {
                this.found = true;
            }
        }

    },
    filterStops:function(stopId){
        var l = stops.length,
            j;
        
        for (j = 0; j < l; j++) {
            stop=stops.features[j];
            console.log(stop);
            if (stopId ===stop.id) {
                return stop;
            }

        }
    },
    filterRoute : function(routeId){
        var l = routes.length,
            r;
            for (r = 0; r < l; r++) {
            route=routes[r];
            if (routeID ===route.properties.id) {
                return route;
            }
        }
    },
   
//GETSTOPS
    getStops :function(trip) {
           var stops = this.stops,
           len = stoptimes.length,
            i;
            
        for (i = 0; i < len; i++){ 
            var stoptime = stoptimes[i];
            console.log(this.filterStops(stoptime.stop_id));
            var stop= this.filterStops(stoptime.stop_id);

            var route = this.filterRoute(stoptime.route_id);
            this.filterStoptimes(stoptime, trip);
            if (this.found) {
                console.log(stop);
                stop.properties.sequence = stoptime.stop_sequence;
                stop.properties.arrival = stoptime.arrival_time;
                stop.properties.depature = stoptime.arrival_time;
                stop.properties.route=route.name;
                stop.properties.headsign = stoptime.headsign;

                stops.push(stop);
                console.log("Found: "+ stop.properties.name )
                
            }
        }
        return stops;
    }

};

var a = TREN.getStops(1);
console.log(prettyjson.render(a));
console.log("This route has : " +a.length + " Stops");