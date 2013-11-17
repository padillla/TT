//some sort of way of getting an API and duct-tape the existing models.

//feel free to laugh at it, or letme know if something can be done better

$(function() {
        // generate unique user id
        var userId = Math.random().toString(16).substring(2, 15),
            socket = io.connect("/"),
            map,
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


            // load leaflet map
            map = L.map("map", {
                //layers: [Heredia, Belen, Cartago, Pavas]
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

       //Adds a KML file according to clicked route *explosive

       //I NEED TO KNOW WHY THIS CODE EXPLODE

var Heredia = new L.KML("/heredia.kml");
var Belen = new L.KML("/belen.kml");
var Cartago = new L.KML("/cartago.kml");
var Pavas = new L.KML("/pavas.kml");

        
function showRoute(route) {
           var route = route; 
            map.addLayer(route); 
            route.on("loaded", function(e) {
                 map.fitBounds(e.target.getBounds());
             }); 
    };

$("#heredia").click(showRoute(Heredia));
$("#belen").click(showRoute(Belen));
$("#cartago").click(showRoute(Cartago));
$("#pavas").click(showRoute(Pavas));
});
  //END OF EXPLOSIVE CODE      
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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


//Returns an array of  stoptime objects  for the current trip  
function getStopTimes(trip) {
    var tripStops = [];
    for (var i = 0, l = stoptimes.length, found = false; i < l; i++) {
        if (stoptimes[i].trip == tripid) {
            found = true;
            tripStops.push(stoptimes[i]);
        }
    }
    if (found) {
        console.log(" this Trip is: " + stoptimes);
        console.log(" Este viaje en tren tiene " + tripStops.length + " paradas");
        return tripStops;
    } else {
        console.log("no stops.");
    };
    }



