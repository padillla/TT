/**
 * User: Rodolfo Padilla
 * Date: 10/7/13
 * Time: 12:30 PM
 *
 */
 $(document).ready(function loadMap() {
        console.log("map lib loaded");
        var notifMsg;
	var map = new GMaps({
		div: '#map',
		lat: 9.9340573930128,
		lng: -84.05647694782
	});
	GMaps.geolocate({
		success: function(position) {
			console.log("gmaps geolocate worked");
			map.setCenter(position.coords.latitude, position.coords.longitude);
			map.addMarker({
				lat: position.coords.latitude,
				lng: position.coords.longitude,
				title: 'You are here',
				infoWindow: {
					content: '<p>Estas aqui</p>'
				}
			});
		notifMsg = "Location: lat= " + position.coords.latitude + ", lon= " + position.coords.longitude;
		},
		error: function(error) {
			notifMsg = 'Geolocation failed: ' + error.message + " Sorry";
		},
		not_supported: function() {
			notifMsg = "Your browser does not support geolocation";
		},
		always: function() {
			$('#notificacion').html(notifMsg);
		}
	});
	
});
