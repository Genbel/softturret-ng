'use strict';

var socketController = require('../app/controllers/webRTC.socket.server.controller');

module.exports = function(io){

    
    io.on('connection', function(client) {
        
        console.log('Connected to the socket');

        client.on('localPing', function(data){
            var TTL = Date.getTime() - data;
            data = {"client" : data, "server": TTL}
            client.emit('localPing', data);
        });

        client.on('PeerPing', function(data){
            var TTL = Date.getTime() - data;
            data = {"client" : data, "server": TTL}
            io.sockets.emit('PeerPing', data);
        });
            
            
    });
    
    console.log('webRTC socket settings set up. Ready to listen!');
    return io;
};