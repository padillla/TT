/**
 * Author: Padilla
 * Date: 10/27/13
 * Time: 12:27 PM
 * This is a mess, feel free to mess it up or tell me better way to do it.
 *
 */



$(document).ready(function() {
	//************************************ Notification

	$('body').append('<div id="notificacion"></div>');

	var notifMsg;
	var jumpNotification = function() {
		var mensaje = notifMsg;
		var $notificacion = $('#notificacion');
		$notificacion.find('span').text(mensaje);
		$notificacion.stop().animate({
			top: '0'
		});
		setTimeout(function() {
			$notificacion.stop().animate({
				top: '-30px'
			});
		}, 100000);
	};

	jumpNotification($('#notificacion'));

});