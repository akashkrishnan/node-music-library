angular.module('myApp.controllers', []).controller('mainCtrl', mainCtrl);
function mainCtrl($scope, $socket, $log, $window, localStorageService) {
  var socket = new $socket($scope);
  $scope.artist = localStorageService.get('artist') || '';
  $scope.album = localStorageService.get('album') || '';
  $scope.title = localStorageService.get('title') || '';
  $scope.genre = localStorageService.get('genre') || '';
  $scope.page = localStorageService.get('page') || 1;
  $scope.limit = 20;
  $scope.download = function (song) {
    $window.location.href = encodeURI('/' + song._id + '/' + song.artist + ' - ' + song.album + ' - ' + pad(song.tracknumber, 2) + ' - ' + song.title + '.mp3').replace('#', '%23').replace('&', '%26').replace('?', '%3F');
  };
  $scope.updateArtists = function () {
    socket.emit(
      'music.artists',
      {
        album: $scope.album,
        title: $scope.title,
        genre: $scope.genre
      },
      function (err, artists) {
        if (err) $log.error(err);
        else $scope.artists = artists;
      }
    );
  };
  $scope.updateAlbums = function () {
    socket.emit(
      'music.albums',
      {
        artist: $scope.artist,
        title: $scope.title,
        genre: $scope.genre
      },
      function (err, albums) {
        if (err) $log.error(err);
        else $scope.albums = albums;
      }
    );
  };
  $scope.updateGenres = function () {
    socket.emit(
      'music.genres',
      {
        artist: $scope.artist,
        album: $scope.album,
        title: $scope.title
      },
      function (err, genres) {
        if (err) $log.error(err);
        else $scope.genres = genres;
      }
    );
  };
  $scope.updateSongs = function () {
    localStorageService.set('artist', $scope.artist);
    localStorageService.set('album', $scope.album);
    localStorageService.set('title', $scope.title);
    localStorageService.set('genre', $scope.genre);
    localStorageService.set('page', $scope.page);
    $scope.updateArtists();
    $scope.updateAlbums();
    $scope.updateGenres();
    socket.emit(
      'music.songs',
      {
        artist: $scope.artist,
        album: $scope.album,
        title: $scope.title,
        genre: $scope.genre,
        offset: ($scope.page - 1) * $scope.limit,
        limit: $scope.limit
      },
      function (err, songs, count) {
        if (err) $log.error(err);
        else {
          $scope.songs = songs;
          $scope.count = count;
        }
      }
    );
  };
  $scope.$watch('artist', $scope.updateSongs);
  $scope.$watch('album', $scope.updateSongs);
  $scope.$watch('title', $scope.updateSongs);
  $scope.$watch('genre', $scope.updateSongs);
  $scope.$watch('page', $scope.updateSongs);
  $scope.updateSongs();
}

function pad(number, digits) {
  return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}
