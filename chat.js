"use strict";

var io = require("socket.io")(5430);
var users = [];
io.on('connection', function(socket){

  console.log('Usuário entrou..', socket.id);
  socket.on('create', function(subject, userName){
    var user = {};
    user.id = socket.id;
    user.name = userName;
    users.push(user);
    //socket.broadcast.emit('new user', user);
    console.log(user.name.toString());
    socket.emit('new user', user);
  });
  socket.on('message', function(message){
    console.log(message);
    io.emit('message', message, socket.id);
  });

  socket.on('disconnect', function(){
    socket.broadcast.emit('leave user', socket.id);
    console.log('Usuário saiu..', socket.id);
  })
});
