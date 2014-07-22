var Config = require('../config.js');
var fs = require('fs');

module.exports = function (app, passport, sockets) {

  app.get('/', index);
  app.get('/:id/:name.mp3', download);
  app.get('*', otherwise);

  function index(req, res) {
    res.render('index', {name: Config.web.name});
  }

  function download(req, res) {
    var id = req.params.id;
    var name = req.params.name;
    var filename = Config.paths.music + '/' + id + '.mp3';
    fs.exists(filename, function (exists) {
      if (exists) {
        res.setHeader('Content-disposition', 'attachment; filename=' + name + '.mp3');
        fs.createReadStream(filename).pipe(res);
      }
      else res.send(404);
    });
  }

  function otherwise(req, res) {
    res.send(404);
  }

};
