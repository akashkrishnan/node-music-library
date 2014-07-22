var Music = require('../models/music.js');

/**
 * @param (Object) sockets
 * @returns {Function(socket)}
 */
module.exports = function (sockets) {
  return function (socket) {

    socket.on('music.artists', function (data, done) {
      if (data) Music.artists(data.album, data.title, data.genre, done);
    });

    socket.on('music.albums', function (data, done) {
      if (data) Music.albums(data.artist, data.title, data.genre, done);
    });

    socket.on('music.genres', function (data, done) {
      if (data) Music.genres(data.artist, data.album, data.title, done);
    });

    socket.on('music.songs', function (data, done) {
      if (data) Music.songs(data.artist, data.album, data.title, data.genre, data.offset, data.limit, done);
      else done('Invalid query.');
    });

  };
};
