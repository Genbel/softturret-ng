'use strict';

var socketController = require('../app/controllers/softturret.socket.server.controller.js');

module.exports = function(io){

    io.on('connection', function(client) {

        client.on('user-connected', function(user){
            var square = socketController.addNewUserInTheSquare(client.id, user);
            console.log(square);
            var newUser = { "socketId" : client.id, "userId": user._id};
            // The last argument is to update or create new settings.
            // Send to the new user the info
            client.emit('square-info', square, 'set-up');
            // Send to other users the update of the square
            client.broadcast.emit('square-info', newUser, 'user-connected');

        });

        client.on('kaixo', function(data){
            console.log('directive kaixo');
            client.emit(data);
        });

        // Event on the small widgets when the user mouse down: Talk
        // @bEnd: With whom wants to speak to user
        client.on('remote-peer-lighting', function(talkToken){
            var data = socketController.getConnectionData(talkToken.remoteEndId, client.id);
            talkToken["remoteEndId"] = data.aEndUserId;
            io.to(data.bEndSocketId).emit('blink', talkToken);
        });

        // Event on the small widgets when the user mouse up: Nothing
        // @bEnd: With whom wants to speak to user
        /*client.on('small-widget-mouse-up', function(bEnd){
            var data = socketController.getConnectionData(bEnd, client.id);
            io.to(data.bEndSocketId).emit('blink-red', data.aEndUserId, 'speak-off');
        });*/

        client.on('disconnect', function() {
            var leftUser = socketController.eraseUserFromTheSquare(client.id);
            // Send message to every client to update the connection state to disconnect
            client.broadcast.emit('square-info', leftUser, 'user-left');
        });


    });

    console.log('webRTC socket settings set up. Ready to listen!');
    return io;
};