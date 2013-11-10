//maps routing, changes KML aacording to request

exports.map = function(req, res , trainroute){
  res.render('map', { title: 'Ruta' }); 
};
