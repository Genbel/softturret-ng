'use strict';

var socketController = require('../app/controllers/webRTC.socket.server.controller.js');

module.exports = function(io){
    
    io.on('connection', function(socket) {
        console.log('Connected to the socket');
        
        socket.on('welcome', function(username) {
            var message = socketController.welcome('You are welcome ' + username);
            console.log(message);
            socket.emit('Hi');
        });
    });
    console.log('webRTC socket settings set up. Ready to listen!');
    return io;
}