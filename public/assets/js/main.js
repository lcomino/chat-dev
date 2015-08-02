var app = angular.module('chatDev', ['ngRoute']);

app.factory('socket', function ($rootScope) {
  var socket = io.connect('http://localhost:5430');
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});

app.controller("createChat", function($scope , socket){
  $scope.create = function(message){
    socket.emit('message', message);
  };
});

app.controller("chat", function($scope, socket){
  var messages = [{
    user : 'lcomino',
    message : 'Mensagem!!!'
  },{
    user : 'patycad',
    message : 'Mensagem2!!!'
  }];

  $scope.messages = messages;

  socket.on('message', function(message){
      $scope.messages.push(message);
  });
});
