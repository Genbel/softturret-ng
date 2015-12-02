'use strict';

var socketController = require('../app/controllers/softturret.socket.server.controller.js');

module.exports = function(io){

    io.on('connection', function(client) {

        client.on('user-connected', function(user){
            var square = socketController.addNewUserInTheSquare(client.id, user);
            client.broadcast.emit('square-updated', square);
        });

        client.on('kaixo', function(data){
            console.log('directive kaixo');
            client.emit(data);
        });

        client.on('disconnect', function() {
            console.log('User disconnected from the softturret');
        });


    });

    console.log('webRTC socket settings set up. Ready to listen!');
    return io;
};