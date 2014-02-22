
$(document).ready(function () {

    var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/5f60f5a8fd1f447b926d50284ef5397c/997/256/{z}/{x}/{y}.png',
        cloudmadeAttribution = '<a href="padillla.github.io">Github</a>, Map data &copy; 2011 OSM 2011 CloudMade',
        cloudmade = new L.TileLayer(
            cloudmadeUrl, {
                maxZoom: 18,
                attribution: cloudmadeAttribution
            }),

        map = new L.Map('map', {
            center: new L.LatLng(9.9335, -84.0780),
            zoom: 12,
            layers: [cloudmade],
            zoomControl: false
        }),


        TinyIcon = L.Icon.extend({
            options: {
                shadowUrl: "../img/marker-shadow.png",
                iconSize: [25, 35],
                iconAnchor: [12, 36],
                shadowSize: [41, 41],
                shadowAnchor: [12, 38],
                popupAnchor: [0, -30]
            }
        }),

        TrainIcon = new TinyIcon({
            iconUrl: "../img/train.png"
        }),

        RailIcon = new TinyIcon({
            iconUrl: "../img/levelcrossing.png"
        }),

        MovingTrainIcon = new TinyIcon({
            iconUrl: "../img/steamtrain.png"
        }),

        RedIcon = new TinyIcon({
            iconUrl: "../img/marker-red.png"
        }),
        YellowIcon = new TinyIcon({
            iconUrl: "../img/marker-yellow.png"
        }),


        invertLatLngs = function (latLngs) {
            var correctedArray = [];
            $.each(latLngs, function (i, innerlatlng) {
                var reversedLatlng = innerlatlng.reverse();
                correctedArray.push(reversedLatlng);

            });
            return correctedArray;
        },


        TREN = {

            markers: [],
            routes: [],
            trips: [],

            loadMapElements: function () {
                $.ajax({
                    url: '/trips',
                    success: function (data) {
                        TREN.trips = data;
                    }

                });

                $.ajax({
                    url: '/stops',
                    success: function (data) {
                        L.geoJson(data, {
                            pointToLayer: function (f, latlng) {
                                return new L.Marker(latlng, {
                                    icon: YellowIcon
                                }).bindPopup('Nombre: ' + f.properties.long_name + '<br>Localidad: ' + f.properties.locality + '<br>Localizacion: ' + f.geometry.coordinates + ' <br> <button id="loadtrips".btn-small> Que trenes pasan aqui?</button>');
                            }
                        }).addTo(map);
                    }
                });

                $.ajax({
                    url: '/routes',
                    success: function (data) {
                        var i;
                        for (i in data) {
                            if (data.hasOwnProperty(i)) {
                                L.geoJson(data[i]).addTo(map);
                                TREN.routes.push(data[i].geometry.coordinates);

                            }
                        }
                        TREN.animateTrains(TREN.routes);
                    }
                });
            },

            animateTrains: function (latLngs) {


                var routeLines = [];

                $.each(latLngs, function (i, line) {

                    line = invertLatLngs(line);
                    var polyline = L.polyline(line);
                    routeLines.push(polyline);
                });



                $.each(routeLines, function (i, routeLine) {
                    var marker = L.animatedMarker(routeLine.getLatLngs(), {
                        icon: MovingTrainIcon,
                        autoStart: false,
                        interval: 400 //miliseconds
                        //onEnd: DoSomeNotificationOnSOCKETIO
                    });
                    marker.bindPopup("A moving train");
                    map.addLayer(marker);

                    TREN.markers.push(marker);
                });

            }
        };

    $(function () {
        $('#start').click(function () {
            console.log('start');
            $.each(TREN.markers, function (i, marker) {
                marker.start();
            });

        });
    });
    $(function () {
        $('#stop').click(function () {
            console.log('stop');
            $.each(TREN.markers, function (i, marker) {
                marker.stop();
            });
        });
    });

    TREN.loadMapElements();

});