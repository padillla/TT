/**
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
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//routes
app.get('/', routes.index);
app.get('/map', map.map);

//map routes for KMLs
app.get('/map/heredia', function(req, res) {
  res.send('Hello from route handler 1');
});
app.get('/map/belen', function(req, res) {
res.send('Hello from route handler 2');
});
app.get('/map/cartago', function(req, res) {
  var trainRoute= req.params.trainRoute;
  
});
app.get('/map/pavas', function(req, res) {
res.send('Hello from route handler 4');
});

// GET /shoes?order=desc&shoe[color]=blue&shoe[type]=converse
req.query.order
// => "desc"

req.query.shoe.color
// => "blue"

req.query.shoe.type
// => "converse"


//http server 
var server = http.createServer(app);
server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});



// Bind socket.io to server
var serv_io = io.listen(server);
serv_io.sockets.on('connection', function(socket) {

  // start listening for coords
  socket.on('send:coords', function(data) {
    console.log(prettyjson.render(data));

    // broadcast coordinates to everyone except you
    socket.broadcast.emit('load:coords', data);

  });
});