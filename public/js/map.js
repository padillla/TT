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
    
       var trips = {};
       var stops= [];
       var routes= {};
       
       
//For some reason these icon ends up undefined
       var StopIcon = L.Icon({
           options:{
                /*iconUrl: '../img/levelcrossing.png',
                shadowSize: new L.Point(0,0),
                iconSize: new L.Point(22, 22),
                iconAnchor: new L.Point(11, 11),
                popupAnchor: new L.Point(0,-9)*/
           }
       });
debugger;

       var TrainIcon = L.Icon({
          options:{
               iconUrl: '../img/train.png',
               shadowUrl: null,
                shadowSize: new L.Point(0,0),
               iconSize: new L.Point(20, 20),
                iconAnchor: new L.Point(10, 10),
                popupAnchor: new L.Point(0,-10)
          }
       });
       
    
       //Pull data to map

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
                           
                           icon: StopIcon
                       }).bindPopup('<b>' + f.properties.stop_name + '</b><br>' + f.properties.stop_longname);
                   }
               }).addTo(map);
           }
       });

       $.ajax({
           url: '/routes',
           success: function(data) {

               for (var i in data) {
                   if (data.hasOwnProperty(i)) {

                       L.geoJson(data[i], {

                       }).addTo(map);
                   }
               }
           }

       });
   });




