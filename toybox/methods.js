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
   // L = require("../public/js/leaflet.js");

//This array stores the stoptimes objects for the current trip

var TREN = {
    
    geoJSON :{
        "type": "FeatureCollection",
        "features": []
    },
    
    //current train latlng. looking forward to add this to map.
    location: [],
    
    //Filter stoptimes with the property trip as an arg and returns an array of stoptimes.
    filterStoptimes: function (trip) {
        
        var tripStops = stoptimes.filter(function (el) {
            return el.trip == trip.number &&
                    el.stop_sequence === trip.stop_sequence ;
            });
         if(tripStops.length !== 0){
            console.log(prettyjson.render(tripStops));
            return tripStops;
            }
            else{return "No stoptimes found for Trip:"  + trip.number;}
    },
    //return al stops with the given ID
    filterStops: function (stopId) {
        console.log( stops );
      var stop= stops.features.filter(function (el) {
            
            return el.properties.id === stopId;
            });
            if(stop.length !== 0){
                console.log(prettyjson.render(stop[0]));
            return stop[0];
            }
            else{return "No stop found for  ID: " + stopId;}
    },

    //returns route object with the given ID
    filterRoute: function (routeId) {
      var route=routes.filter(function (el) {
            return el.properties.id === routeId;
            });
            if(route.length !== 0){
              console.log(prettyjson.render(route[0]));
            return route[0];
            }
            else {return "No route found for  ID:" + routeId;}
            },

    
    //returns an object with 
    filterTrip: function (tripNumber) {
        var trip=trips.filter(function (el) {
            return el.number == tripNumber;
            });
         if(trip.length !== 0){
            console.log(prettyjson.render(trip));
            return trip[0];
            }
            else {return "No trip found for number:" + tripNumber;}
            },

    //GETSTOPS returns an array on geojson objects with the markers for the stop
    getStopmarkers: function (trip) {
    var stopMarkers= [],
        trip= this.filterTrip(trip),
        stopTimes= this.filterStoptimes(trip),
        i,
        len= stopTimes.length;
    
    for (i=0; i<len; i++){
    var stoptime=stopTimes[i], 
        stop= this.filterStops(stoptime.stop_id);
        stop.properties.sequence = stoptime.stop_sequence; 
        stop.properties.arrival = stoptime.arrival_time; 
        stop.properties.depature = stoptime.arrival_time;
        stop.properties.headsign = stoptime.headsign;
        stopMarkers.push(stop);
    }
    console.log("Created " + stopMarkers.length + " stops");
    console.log(prettyjson.render(stopMarkers));
    return stopMarkers;
    },

    //Fill GeoJSON with markers and stops for the given trip #,
    // then adds GeoJSON to the map *EXPLOSIVE
    loadTrip: function (tripNumber) {
          //  clearRoutes();
            
            
        var trip = this.filterTrip(tripNumber),
            stopMarkers = this.getStopmarkers(tripNumber),
            route = this.filterRoute(trip.route_id),
            features = this.geoJSON.features;
        
         //  setMarker(stopMarkers);
       

            features.push(route); 
            features.flatten(stopMarkers, features);
        
       
        
         console.log("Route name: "+ route.properties.name);
       console.log(prettyjson.render(features));
       
      //  tripLayer.addData(this.geoJSON).fitBounds(tripLayer.getBounds());
        //return ;
        
    }

    
};
exports.TREN = TREN;


TREN.loadTrip(15);