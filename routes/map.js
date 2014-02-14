//maps routing, changes KML aacording to request

exports.map = function(req, res ){
  res.render('map', { title: 'Ruta' }); 
};

exports.trip = function(req, res ){
  res.render('trip'); 
};