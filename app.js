/*
 * Module dependencies.
 */
var express = require('express'),
  routes = require('./routes'),
  map = require('./routes/map'),
  http = require('http'),
  path = require('path'),
  io = require('socket.io'),
  prettyjson = require('prettyjson'),
  app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

//Some sort of API

app.get('/', map.map);


app.get('/routes', function(req, res) {
  res.sendfile('public/models/routes.json');
});
app.get('/stops', function(req, res) {
  res.sendfile('public/models/stops.json');
});
app.get('/stoptimes', function(req, res) {
  res.sendfile('public/models/stoptimes.json');
});
app.get('/trips', function(req, res) {
  res.sendfile('public/models/trips.json');
});

app.get('/ruta/:route/:trip_n', function(req, res) {
  map.trip(req.params.route, req.params.trip_n, function(data, num, err) {
    if (err) {
      console.log(err);
      res.send('Invalid request :' + err);
    } else {
      res.send(data);
    }
  });
});


var server = http.createServer(app);
server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});



//  Bind socket.io to server
// var serv_io = io.listen(server);
// serv_io.sockets.on('connection', function(socket) {

//   // start listening for coords
//   socket.on('send:coords', function(data) {
//     console.log(prettyjson.render(data));

//     // broadcast coordinates to everyone except you
//     socket.broadcast.emit('load:coords', data);

//   });
// });