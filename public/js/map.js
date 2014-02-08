   $(document).ready(function() {

     var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/3a83164a47874169be4cabc2e8b8c449/43782/256/{z}/{x}/{y}.png';
     var cloudmadeAttribution = '<a href="padillla.github.io">Github</a>, Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';
     var cloudmade = new L.TileLayer(
       cloudmadeUrl, {
         maxZoom: 18,
         attribution: cloudmadeAttribution
       });

     var map = new L.Map('map', {
       center: new L.LatLng(9.9335, -84.0780),
       zoom: 13,
       layers: [cloudmade],
       zoomControl: false
     });
     var routes = [];


     var tinyIcon = L.Icon.extend({
       options: {
         shadowUrl: "../img/marker-shadow.png",
         iconSize: [25, 35],
         iconAnchor: [12, 36],
         shadowSize: [41, 41],
         shadowAnchor: [12, 38],
         popupAnchor: [0, -30]
       }
     });

     var trainIcon = new tinyIcon({
       iconUrl: "../img/train.png"
     });

     var railIcon = new tinyIcon({
       iconUrl: "../img/levelcrossing.png"
     });

     var movingTrainIcon = new tinyIcon({
       iconUrl: "../img/steamtrain.png"
     });

     var redIcon = new tinyIcon({
       iconUrl: "../img/marker-red.png"
     });
     var yellowIcon = new tinyIcon({
       iconUrl: "../img/marker-yellow.png"
     });



     //push data to map

     $.ajax({
       url: '/trips',
       success: function(data) {
         trips = data;
       }

     });

     $.ajax({
       url: '/stops',
       success: function(data) {

         L.geoJson(data, {
           pointToLayer: function(f, latlng) {

             return new L.Marker(latlng, {

               icon: yellowIcon
             }).bindPopup('Nombre: ' + f.properties.long_name + '<br>Localidad: ' + f.properties.locality + '<br>Localizacion: ' + f.geometry.coordinates);
           }
         }).addTo(map);
       }
     });

     $.ajax({
       url: '/routes',
       success: function(data) {

         for (var i in data) {
           if (data.hasOwnProperty(i)) {
             L.geoJson(data[i]).addTo(map);
             routes.push(data[i].geometry.coordinates);

           }
         }
         animateTrains(routes)
       }
     });

     var animateTrains = function(latLngs) {


       var routeLines = [],
         markers = [];

       $.each(latLngs, function(i, line) {

         line = invertLatLngs(line);
         var polyline = L.polyline(line);
         routeLines.push(polyline);
       });



       $.each(routeLines, function(i, routeLine) {
         var marker = L.animatedMarker(routeLine.getLatLngs(), {
           icon: movingTrainIcon,
           autoStart: false,
           /*onEnd: function() {
             $(this._shadow).fadeOut();
             $(this._icon).fadeOut(3000, function() {
               map.removeLayer(this);
             });
           }*/
         });

         map.addLayer(marker);
         markers.push(marker);
       });

       $(function() {
         $('#start').click(function() {
           console.log('start');
           $.each(markers, function(i, marker) {
             marker.start();
           });

         });
       });
     };

     ///Ugly function to invert lat lng on routes, 
     //when these are inverted and leaflet position the markers 
     //in the south pole, I dont know why the hell it does that.
     var invertLatLngs = function(latLngs) {
       var correctedArray = [];
       $.each(latLngs, function(i, innerlatlng) {
         var reversedLatlng = innerlatlng.reverse();
         correctedArray.push(reversedLatlng);

       });
       return correctedArray;
     }


   });
    // TODO:  Add animated marker for moving train