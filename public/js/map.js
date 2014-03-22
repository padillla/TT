$(document).ready(function() {
    // map attributes TODO Chnge tile provider CLOUDMADE WILL close tile API

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

        //Icon definition TODO: make better icons for stops
        TinyIcon = L.Icon.extend({
            options: {
                shadowUrl: "../img/marker-shadow.png",
                iconSize: [30, 40],
                iconAnchor: [12, 36],
                shadowSize: [41, 41],
                shadowAnchor: [12, 38],
                popupAnchor: [0, -30]
            }
        }),

        TrainIcon = new TinyIcon({
            iconUrl: "../img/train.png"
        }),

        MovingTrainIcon = new TinyIcon({
            iconUrl: "../img/steamtrain.png",
            //TODO: Remove this when I have better icon that do not cover stop icons when on the stop
            iconAnchor: [30, 36]
        }),

        RedIcon = new TinyIcon({
            iconUrl: "../img/marker-red.png"
        }),
        YellowIcon = new TinyIcon({
            iconUrl: "../img/marker-yellow.png"
        }),

        //Returns the array with every lat lon reversed, so it wont mark the moving routes in Antartica. 
        //TODO: Find a way around this


        invertLatLngs = function(latLngs) {
            var correctedArray = [];
            $.each(latLngs, function(i, innerlatlng) {
                var reversedLatlng = innerlatlng.reverse();
                correctedArray.push(reversedLatlng);

            });
            return correctedArray;
        },
        //Returns a date object receiving only a "HH:MM" string
        //Stoptimes has that format. I think its ugly
        parseTime = function(time) {
            var dat = new Date();
            time.split(/\:|\-/g);
            dat.setHours(time[0]);
            dat.setMinutes(time[1]);
            return dat;
        },

        TREN = {

            stops: [],
            routes: [],
            trips: [],
            stoptimes: [],
            markers: [],
            //Make stop markers and road line magically appear on the map
            loadMapElements: function() {

                //Pulls trips  
                $.ajax({
                    url: '/trips',
                    success: function(data) {
                        $.each(data, function(i, val) {
                            TREN.trips.push(val);
                        });
                    }
                });
                //Pulls Stop objets and place the markers with a button whith the stop ID as an ID Attribute 
                $.ajax({
                    url: '/stops',
                    success: function(data) {
                        var stopId;
                        L.geoJson(data, {
                            pointToLayer: function(f, latlng) {
                                var stop = f.properties;
                                stopId = f.properties.id;
                                TREN.stops.push(f);
                                return new L.Marker(latlng, {
                                    icon: TrainIcon
                                }).bindPopup('Nombre: ' + stop.long_name + '<br>Localidad: ' + stop.locality + '<br>Localizacion: ' + f.geometry.coordinates + ' <br> <button class= "btn" ' + 'id=' + stopId + ' href= "#info"> Que trenes pasan aqui?</button>');
                            }
                        }).addTo(map);
                    }
                });
                //Pulls routes
                $.ajax({
                    url: '/routes',
                    success: function(data) {
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
                //Pulls stoptimes 
                $.ajax({
                    url: '/stoptimes',
                    success: function(data) {
                        $.each(data, function(i, val) {
                            TREN.stoptimes.push(val);
                        });


                    }

                });

            },

            // receives a stop Id and returns the matching stop object
            getStopById: function(stopId) {
                var stop;

                function filterStop(i) {
                    //TODO: somplify all these ugliness for ternary op's
                    if (i.properties.id === stopId) {
                        return true;
                    } else {
                        return false;
                    }
                }
                stop = TREN.stops.filter(filterStop);
                return stop.shift();

            },
            // just moves the train maker on the map.
            // TODO: Make this to listen to server with socket.io, for example.
            animateTrains: function(latLngs) {


                var routeLines = [];

                $.each(latLngs, function(i, line) {

                    line = invertLatLngs(line);
                    var polyline = L.polyline(line);
                    routeLines.push(polyline);
                });



                $.each(routeLines, function(i, routeLine) {
                    var marker = L.animatedMarker(routeLine.getLatLngs(), {
                        icon: MovingTrainIcon,
                        autoStart: false,
                        interval: 4000 //miliseconds
                        //onEnd: DoSomeNotificationOnSOCKETIO
                    });

                    map.addLayer(marker);
                    TREN.markers.push(marker);

                });

            },
            //This gets which trains will arrive  in the selected stop.
            //receives an stop id number and returns an array of stoptimes with the stop as a property of each passing train object 
            getPassingTrains: function(Id) {

                //in case you wonder, this makes the string a number.
                var stopId = +Id,

                    passingTrains = [],

                    time;

                function filterStoptime(i) {

                    if (i.stop_id === stopId) {

                        i.stop = TREN.getStopById(stopId);
                        passingTrains.push(i);
                        //i.arrival_time = parseTime(i.arrival_time);
                        //i.departure_time = parseTime(i.departure_time);

                        return true;
                    } else {
                        return false;
                    }
                }
                TREN.stoptimes.filter(filterStoptime);
                //passingTrains.sortByProperty()
                makeList(passingTrains);
                return passingTrains;
            }
        };


    function sortByProperty(property) {
        'use strict';
        return function(a, b) {
            var sortStatus = 0;
            if (a[property] < b[property]) {
                sortStatus = -1;
            } else if (a[property] > b[property]) {
                sortStatus = 1;
            }

            return sortStatus;
        };
    }



    // attach a <li> with information on each passing train 
    //this need to be beautified, it diplays each train that passes and where it goes. TODO MAKE this a floating info window, or just something that looks better
    function makeList(json) {
        var table = $('#table');
        table.append('<h4 #h4-title>' + json[1].stop.properties.long_name + '</h4>');

        $(function() {
            $('#headings th').click(function() {
                var id = $(this).attr('id');
                var asc = (!$(this).attr('asc')); // switch the order, true if not set

                // set asc="asc" when sorted in ascending order
                $('#headings th').each(function() {
                    $(this).removeAttr('asc');
                });
                if (asc) {
                    $(this).attr('asc', 'asc');
                }

                sortResults(id, asc);
            });
            showResults();
        });

        function sortResults(prop, asc) {
            json = json.sort(function(a, b) {
                if (asc) {
                    return (a[prop] > b[prop]);
                } else {
                    return (b[prop] > a[prop]);
                }
            });
            showResults();
        }

        function showResults() {
            var row = '';
            var html = '';
            for (var e in json) {
                html += '<tr>' + '<td>' + json[e].arrival_time + '</td>' + '<td>' + json[e].headsign + '</td>' + '<td>' + json[e].departure_time + '</td>' + '</tr>';
            }
            $('#results').html(html);
        }
    }
    // Bind Click listerners to buttons
    $(function() {
        $('#start').click(function() {

            $.each(TREN.markers, function(i, marker) {
                marker.start();
                console.log('start');
            });

        });
    });
    $(function() {
        $('#stop').click(function() {

            $.each(TREN.markers, function(i, marker) {
                marker.stop();
                console.log('stop');
            });
        });
    });



    $(document).on('click', '.btn', function(e) {
        var id = e.target.id;
        $('#results, #table>h4').empty();
        console.log(TREN.getPassingTrains(id));
    });

    TREN.loadMapElements();

});


/*
 */