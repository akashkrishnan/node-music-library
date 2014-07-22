angular.module('myApp.services', [])
  .factory('$socket', $socket);
function $socket($rootScope, $timeout) {
  var socket = io.connect();
  return function ($scope) {
    var listeners = [];
    this.on = function (eventName, callback) {
      var listener = {
        eventName: eventName,
        callback: function () {
          var args = arguments;
          $timeout(function () {
            callback.apply(socket, args);
          }, 0);
        }
      };
      socket.on(listener.eventName, listener.callback);
      listeners.push(listener);
    };
    this.emit = function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    };
    $scope.$on('$destroy', function () {
      listeners.forEach(function (listener) {
        socket.removeListener(listener.eventName, listener.callback);
      });
    });
  };
}
