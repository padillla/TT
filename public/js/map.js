

//some sort of way of getting an API and duct-tape the existing models.

//feel free to laugh at it, or let me know if something can be done better
    
    
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
        map.setView([lat, lng], 16);
    
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
   
    

    //Adds a KML file according to clicked route *explosive
  
    var Heredia = new L.KML("/heredia.kml", {async:true});
    var Belen = new L.KML("/belen.kml", {async:true});
    var Cartago = new L.KML("/cartago.kml", {async:true});
    var Pavas = new L.KML("/pavas.kml", {async:true});

  

  //Loads KML
var showRoute= function(route) {
    var firstMarker;
    
   map.setView(route.latLngs[0], 13); 
   map.addLayer(route);
   //added marker for a side of the route
   //TODO: Make this load markers for every stop on the highlited route;
   firstMarker = L.marker(route.latLngs[0], {
                icon: yellowIcon
            }).addTo(map);
        firstMarker.bindPopup("<p>This is the initial point of the route</p>" );
        
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
  
    $("#heredia").click( function () {
        console.log(' Heredia Works!');

        clearRoutes();
        showRoute(Heredia);});
  
    $("#belen").click(function () {
        console.log('Belen Works!');
        clearRoutes();
        showRoute(Belen);});
    //$("#cartago").click(showRoutes(Cartago));  <<I have to create this KML
    $("#pavas").click(function () {
        clearRoutes();
        console.log('Pavas Works!');
        showRoute(Pavas);
});});