var app = angular.module('chatDev', ['ngRoute']);

app.factory('socket', function ($rootScope) {
  var socket = "";
  return {
    connect :function(url){
      socket = io.connect(url);
    },
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

app.run(function(socket){
  socket.connect('http://localhost:5430');
});

app.controller("CreateChatCtrl", function($scope , socket){

});

app.controller("ChatCtrl", function($scope, socket){
  $scope.users = [];
  $scope.user = {};
  var messages = [{
    user : 'lcomino',
    message : 'Mensagem!!!'
  },{
    user : 'patycad',
    message : 'Mensagem2!!!'
  }];

  $scope.messages = messages;

  socket.on('message', function(message, socket){
      var m = {};
      m.user = $scope.users.filter(function(el){
        if(el.id == socket)
          return true;
      })[0].name;
      m.message = message;
      console.log(m);
      $scope.messages.push(m);
      $scope.message = "";
  });

  $scope.enviar = function(message){
    socket.emit('message', message);
  };

  $scope.key = function($event){
        if ($event.keyCode == 13)
            $scope.enviar($scope.message);
  };

  socket.on('new user', function(user){
    $scope.users.push(user);
    $scope.messages.push({user: user.name, message: 'conectou-se'});
    console.log($scope.user);
  });

  $scope.create = function(user, chat){
    socket.emit('create', chat.subject, user.name);
    window.location.hash = chat.subject;
  };
});
