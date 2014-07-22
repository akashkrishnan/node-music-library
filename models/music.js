var Config = require('../config.js');
var mongojs = require('mongojs');

var db = mongojs(Config.mongodb.host + ':' + Config.mongodb.port + '/' + Config.mongodb.db, ['music']);

module.exports = {
  artists: artists,
  albums: albums,
  genres: genres,
  songs: songs
};

function artists(album, title, genre, done) {
  db.music.distinct(
    'artist',
    {
      album: {$regex: '(' + (album || '.*') + ')', $options: 'i'},
      title: {$regex: '(' + (title || '.*') + ')', $options: 'i'},
      genre: {$regex: '(' + (genre || '.*') + ')', $options: 'i'}
    },
    done
  );
}

function albums(artist, title, genre, done) {
  db.music.distinct(
    'album',
    {
      artist: {$regex: '(' + (artist || '.*') + ')', $options: 'i'},
      title: {$regex: '(' + (title || '.*') + ')', $options: 'i'},
      genre: {$regex: '(' + (genre || '.*') + ')', $options: 'i'}
    },
    done
  );
}

function genres(artist, album, title, done) {
  db.music.distinct(
    'genre',
    {
      artist: {$regex: '(' + (artist || '.*') + ')', $options: 'i'},
      album: {$regex: '(' + (album || '.*') + ')', $options: 'i'},
      title: {$regex: '(' + (title || '.*') + ')', $options: 'i'},
    },
    done
  );
}

function songs(artist, album, title, genre, offset, limit, done) {
  var query = {
    artist: {$regex: '(' + (artist || '.*') + ')', $options: 'i'},
    album: {$regex: '(' + (album || '.*') + ')', $options: 'i'},
    title: {$regex: '(' + (title || '.*') + ')', $options: 'i'},
    genre: {$regex: '(' + (genre || '.*') + ')', $options: 'i'}
  };
  db.music.count(query, function (err, count) {
    if (err) done(err);
    else db.music.find(query).sort({artist: 1, album: 1, tracknumber: 1}).skip(offset).limit(limit, function (err, songs) {
      if (err) done(err);
      else done(null, songs, count);
    });
  });
}
