//some sort of way of getting an API and duct-tape the existing models.
//feel free to laugh at it, or let me know if something can be done better
//off course this isnt production yet, Its as explosive as you can imagine.
//a couple array functions
function forEach(array, action) {
    for (var i = 0; i < array.length; i++)
        action(array[i]);
}

function flatten(arrays) {
    var result = [];
    forEach(arrays, function (array) {
        forEach(array, function (element) {
            result.push(element);
        });
    });
    return result;
}


//< Leaflet map
var map = L.map('map');
 // leaflet API key tiler
L.tileLayer("http://{s}.tile.cloudmade.com/5f60f5a8fd1f447b926d50284ef5397c/997/256/{z}/{x}/{y}.png", {
    maxZoom: 18,
    detectRetina: true
    }).addTo(map);

var TREN = {
    
    geoJSON :{
        "type": "FeatureCollection",
        "features": []
    },
    
    //current train latlng. looking forward to add this to map.
    location: [],
    found: false,
    //Filter stoptimes with the property trip as an arg and returns an array of stoptimes.
    filterStoptimes: function (trip) {
        
        var tripStops = stoptimes.filter(function (el) {
            return el.trip == trip.number &&
                    el.stop_sequence === trip.stop_sequence ;
            });
         if(tripStops.length !== 0){
             console.log("Found stops :" + tripStops);
            return tripStops;
            }
            else{return "No stoptimes found for Trip:"  + trip.number;}
    },
    //return al stops with the given ID
    filterStops: function (stopId) {
      
        var stops=Stops.features.filter(function (el) {
            
            return el.properties.id === stopId;
            });
            if(stops.length !== 0){
                console.log("Found stops :" + stops.length);
            return stops[0];
            }
            else{return "No stop found for  ID: " + stopId;}
    },

    //returns route object with the given ID
    filterRoute: function (routeId) {
      var route=routes.filter(function (el) {
            return el.properties.id === routeId;
            });
            if(route.length !== 0){
                console.log("Route :" + route[0].properties.name);
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
    return stopMarkers;
    },

    //Fill GeoJSON with markers and stops for the given trip #,
    // then adds GeoJSON to the map *EXPLOSIVE
    loadTrip: function (tripNumber) {
            clearRoutes();
            
            
        var trip = this.filterTrip(tripNumber),
            stopMarkers = this.getStopmarkers(tripNumber),
            route = this.filterRoute(trip.route_id),
            features = this.geoJSON.features;
        
            setMarker(stopMarkers);
       

            features.push(route);
        
       
        
         console.log("Route name: "+ route.properties.name);
       
       
        tripLayer.addData(this.geoJSON).fitBounds(tripLayer.getBounds());
        //return ;
        
    }

    
};
// geojson layer
var tripLayer = L.geoJson( TREN.geoJSON, {
			onEachFeature: function (feature, layer) {
				layer.bindPopup(feature.properties.name);
			}
		}).addTo(map);


// generate unique user id
var userId = Math.random().toString(16).substring(2, 15),
    socket = io.connect("/"),
    info = $("#infobox"),
    doc = $(document);

// custom marker's icon styles
var tinyIcon = L.Icon.extend({
    options: {
        shadowUrl: "../img/marker-shadow.png",
        iconSize: [25, 39],
        iconAnchor: [12, 36],
        shadowSize: [41, 41],
        shadowAnchor: [12, 38],
        popupAnchor: [0, -30]
    }
});
var redIcon = new tinyIcon({
    iconUrl: "../img/marker-red.png"
});
var yellowIcon = new tinyIcon({
    iconUrl: "../img/marker-yellow.png"
});


var sentData = {},
    connects = {},
    markers = {},
    active = false;

socket.on("load:coords", function (data) {
    // remember users id to show marker only once
    if (!(data.id in connects)) {
        setMarker(data);
    }

    connects[data.id] = data;
    connects[data.id].updated = $.now(); // shorthand for (new Date).getTime()
});

// check whether browser supports geolocation api
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionSuccess, positionError, {
        enableHighAccuracy: true,
        watch: true
    });
} else {
    $(".map").text("Your browser is out of fashion, there\'s no geolocation!");
}

function positionSuccess(position) {
    var lat = position.coords.latitude,
        lng = position.coords.longitude,
        acr = position.coords.accuracy;

    // mark user's position
    var userMarker = L.marker([lat, lng], {
        icon: redIcon
    });

    // set map bounds
    map.fitWorld();
    userMarker.addTo(map);
    userMarker.bindPopup("<p> ID :" + userId + "</p>\n" +
        "<p> Latitude: " + lat + " </p>\n" +
        "<p> Longitude: " + lng + "</p>\n" +
        "<p> Acc: " + acr + "</p>")
        .openPopup();
    //zoom map to current location
    map.setView([lat, lng], 12);

    // send coords on when user is active
    doc.on("click", function () {
        active = true;

        sentData = {
            id: userId,
            active: active,
            coords: [{
                lat: lat,
                lng: lng,
                acr: acr
            }]
        };
        socket.emit("send:coords", sentData);
    });
}

doc.bind("mouseup mouseleave", function () {
    active = false;
});
// showing markers for connections 

function setMarker(objArray) {
    var len = objArray.length;
        
    
    for (var i = 0; i < len; i++) {
        var latLng = objArray[i].geometry.coordinates.reverse(),
            properties = objArray[i].properties,
            marker = L.marker(latLng, {
            icon: yellowIcon
        });
        marker.addTo(map);
        
        marker.bindPopup("<p> ID :" + properties.id + "</p>\n" +
        "<p> LatLng " + objArray[i].geometry.coordinates + " </p>\n" +
        "<p> Name: " + properties.name + "</p>\n" );
       
    }
}

// handle geolocation api errors
function positionError(error) {
    var errors = {
        1: "Authorization fails", // permission denied
        2: "Can\'t detect your location", //position unavailable
        3: "Connection timeout" // timeout
    };
    showError("Error: " + errors[error.code]);
}

function showError(msg) {
    info.addClass("error").text(msg);
}


// delete inactive users every 60 sec
setInterval(function () {
    for (var ident in connects) {
        if ($.now() - connects[ident].updated > 60000) {
            delete connects[ident];
            map.removeLayer(markers[ident]);
            console.log("Deleted User: - " + userId + " - due to inactivity during 60 seconds");
        }
    }
}, 60000);


//Routes geojson layers

var Heredia = L.geoJson(routes[0]),
 Belen = L.geoJson(routes[1]),
 Pavas = L.geoJson(routes[2]),
 Cartago = L.geoJson(routes[3]),
 overlays = {
    "Heredia": Heredia,
    "Belen": Belen,
    "Pavas": Pavas,
    "Cartago": Cartago
};

L.control.layers(overlays).addTo(map);

//
//Loads routes and markers
var showRoute = function (route) {
    map.addLayer(route).fitBounds(route.getBounds());
};

/// removes all layers from map
var clearRoutes = function () {
    map.removeLayer(Belen);
    map.removeLayer(Heredia);
    map.removeLayer(Cartago);
    map.removeLayer(Pavas);
   
};

////Click handler for routes

$(document).ready(function () {

    $("#heredia").click(function () {
        console.log(Heredia);
        clearRoutes();
        showRoute(Heredia);
    });

    $("#belen").click(function () {
        console.log('Belen Works!');
        clearRoutes();
        showRoute(Belen);
    });
    $("#cartago").click(function () {
        clearRoutes();
        showRoute(Cartago);
        console.log("Cartago works!");
    });
    $("#pavas").click(function () {
        clearRoutes();
        console.log('Pavas Works!');
        showRoute(Pavas);
    });
});








