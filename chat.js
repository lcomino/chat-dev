"use strict";

var io = require("socket.io")(5430);

io.on('connection', function(socket){
  socket.broadcast.emit('new user', socket.id);
  console.log('Usuário entrou..', socket.id);
  socket.on('message', function(message){
    console.log(message);
    io.emit('message', message, socket.id);
  });

  socket.on('disconnect', function(){
    socket.broadcast.emit('leave user', socket.id);
    console.log('Usuário saiu..', socket.id);
  })
});
