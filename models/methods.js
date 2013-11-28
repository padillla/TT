
//gets an array of stoptimes objects

var getStopTimes = function(trip) {
var tripStops = [],
len = train.stoptimes.length;
for (var i = 0, l = len, found = false; i < l; i++) {
if (train.stoptime[i].trip == trip) {
found = true;
tripStops.push(train.stoptime[i]);
}
}
if (found) {
//console.log(" this Trip is: " + stoptimes);
console.log(" Este viaje en tren tiene " + tripStops.length + " paradas");
console.log(tripStops);
} else {
console.log("no stops.");
}
};
getStopTimes(90);
