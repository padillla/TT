

//some sort of way of getting an API and duct-tape the existing models.

//feel free to laugh at it, or let me know if something can be done better
//off course this isnt production yet, Its as explosive as you can imagine.
    
    //< Leaflet map
    var map = L.map('map');
    
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

    socket.on("load:coords", function(data) {
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
    

        // leaflet API key tiler
        L.tileLayer("http://{s}.tile.cloudmade.com/5f60f5a8fd1f447b926d50284ef5397c/997/256/{z}/{x}/{y}.png", {
            maxZoom: 18,
            detectRetina: true
        }).addTo(map);

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
        doc.on("click", function() {
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
 
    doc.bind("mouseup mouseleave", function() {
        active = false;
    });
    // showing markers for connections

    function setMarker(data) {
        
        for (var i = 0; i < data.coords.length; i++) {
            var marker = L.marker([data.coords[i].lat, data.coords[i].lng], {
                icon: yellowIcon
            }).addTo(map);
            marker.bindPopup("<p>One more external user is here!</p>" + data.coords[i].userId);
            markers[data.id] = marker;
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
    setInterval(function() {
        for (var ident in connects) {
            if ($.now() - connects[ident].updated > 60000) {
                delete connects[ident];
                map.removeLayer(markers[ident]);
                console.log("Deleted User: - " + userId + " - due to inactivity during 60 seconds");
            }
        }
    }, 60000);
   
    //var bounds = [9.9329,-84.0752];

    //Routes geojson layers
  
    var Heredia = L.geoJson(routes[0]);
    var Belen = L.geoJson(routes[1]);
    var Cartago = L.geoJson(routes[3]);
    //testing var for stop marker loading *Explosive
    var Pavas = L.geoJson(routes[2]);


var overlays = {
            "Heredia": Heredia,
            "Belen": Belen,
            "Pavas": Pavas,
            "Cartago":Cartago
        };

L.control.layers(overlays).addTo(map);





//

  //Loads routes and markers
var showRoute= function(route) {
    map.setView(bounds, 13); 
    map.addLayer(route);
  
       };
       
/// removes all layers from map
var clearRoutes= function(){
    map.removeLayer(Belen);
    map.removeLayer(Heredia);
    map.removeLayer(Cartago);
     map.removeLayer(Pavas);
};
      
      ////Click handler for routes
      
     $(document).ready(function () {
  
    $("#heredia").click( function () 
    {
        console.log(Heredia);
        clearRoutes();
        showRoute(Heredia);});
  
    $("#belen").click(function () {
        console.log('Belen Works!');
        clearRoutes();
        showRoute(Belen);});
    $("#cartago").click(function(){
        clearRoutes();
        showRoute(Cartago);
        console.log("Cartago works!");
        });
    $("#pavas").click(function () {
        clearRoutes();
        console.log('Pavas Works!');
        showRoute(Pavas);
});});



var TREN = {

    
    GeoJSON:{
            "type": "FeatureCollection",
            "features": []
        },
        
    bounds:[],
    //current train latlng. looking forward to add this to map.
    location: [],
    
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
    
    //return al stops with the given ID
    filterStops:function(stopId){
        var l = AllStops.features.length,
            stop,
            j;
        for (j = 0; j < l; j++) {
            stop=AllStops.features[j];
            if (stopId === stop.properties.id) {
                
               return stop;
            }
        }
    },
    
    //returns route object with the given ID
    filterRoute : function(routeId){
        var l = routes.length,
        route,
            r;
           
            for (r = 0; r < l; r++) {
            route=routes[r];
           
            if (route){
                if (routeId === route.properties.id) {
                   
                return route;
                }
                
            }
        }
    },
    
    filtertrip : function(tripNumber){
        var l = trips.length,
        trip,
            i;
           
            for (i = 0; i < l; i++) {
            trip=trips[i];
           
            if (trip){
            
            //this probably gets a number, so better no triple equals. I guess.
                if (tripNumber == trip.number) {
                   
                return trip;
                }
                
            }
        }
    },
   
//GETSTOPS returns an array on geojson objects with the markers for the stop
    getStops :function(trip) {
        var stopMarkers= [],
            len = stoptimes.length,
            i;
            
        for (i = 0; i < len; i++){ 
            var stoptime = stoptimes[i],
                stop= this.filterStops(stoptime.stop_id);
                this.filterStoptimes(stoptime, trip);
            if (this.found) {
               
                 
                stop.properties.sequence = stoptime.stop_sequence;
                stop.properties.arrival = stoptime.arrival_time;
                stop.properties.depature = stoptime.arrival_time;
                
                stop.properties.headsign = stoptime.headsign;
                stopMarkers.push(stop);
                console.log("Found: "+ stop.properties.name);
                
            }
        }
        return stopMarkers;
    },
    //Fill GeoJSON with markers and stops for the given trip #,
    // then adds GeoJSON to the map and set the bounds to its first object coordinates. EXPLOSIVE
    loadTrip: function(tripNumber){
        var trip= this.filterTrips(tripNumber),
            stopMarkers =this.getStops(tripNumber),
            route=this.filterRoutes(trip.route_id),
            features=this.GeoJSON.features,
            bounds= this.bounds;
        
        features.push(route);
        features.concat.apply(stopMarkers, route);
        
        bounds= features.[0].properties.coordinates[0];
        this.GeoJSON.addTo(map);
        map.setView(bounds,16);
        debugger;   
        
    }

};
TREN.loadTrip(1);