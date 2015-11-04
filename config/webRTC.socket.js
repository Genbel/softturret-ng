'use strict';

var socketController = require('../app/controllers/webRTC.socket.server.controller');
var uuidGenerator = require('node-uuid');
var Room = require('../app/models/objets/room');

module.exports = function(io){
    
    // Initiate the square management variables
    // @square: object. All the client that are connected to the server
    var square = {};
    // @rooms: object. How many rooms are in that square. Each room will be
    // created of two peers. Each peer can only be in one room
    var rooms = {};
    // @clients: array. That object will hold all the clients objects
    var clients = [];

    
    io.on('connection', function(client) {
        
        console.log('Connected to the socket');
        
        // User authenticate in the system so we have to notify to the socket to uptade variables
        // @username: client username
        client.on('user-authenticated', function(username) {    
            
            square[client.id] = {"name" : username, "room" : null };
            io.sockets.emit('square-updated', square);
        });
        
        // One customer wants to initiate the call. We call to that peer initiator
        // @joinerSocketId: The id of the peer that the initiator wants to call.
        client.on('initiator-request', function(joinerSocketId) {
            console.log('Initiator request ' + joinerSocketId);
            
            // Parameters for room creation
            var roomUUID = uuidGenerator.v4();
            var roomOwner = square[client.id].name;
            var room = new Room(roomUUID, roomOwner);
            // Add roomOwner as a member of the group
            room.addPerson(client.id);
            // Add in rooms global variable the new room
            rooms[roomUUID] = room;
            // Auto-join the initiator client to the room(global socket)
			client.join(roomUUID);
			// Update the client room key
			square[client.id].room = roomUUID;
            // Sent to the joiner the call request
            io.sockets.to(joinerSocketId).emit('call-request', { "initiator" : roomOwner, "uuid" : roomUUID, "sid" : client.id });
        });
        
        client.on('call-accepted', function(initiatorSId) {
            console.log(client.id + ' call-accepted');
            var roomUUID = square[initiatorSId].room;
            // Update the client room key
			square[client.id].room = roomUUID;
            // Add in the server socket room, the joiner socket
            client.join(roomUUID);
            // Add the client in the global room variable
            rooms[roomUUID].addPerson(client.id);
            rooms[roomUUID].editStatus("full");
            client.broadcast.to(roomUUID).emit('update-uuid', roomUUID);
            console.log(square);
        });
        
        // Clean the room and square variables when one user disconnet not properly. Default call.
        // It calls when the user close the window
        client.on('disconnect', function(){
            console.log(client.id + " left the room forever! The client left the room unexpectedly");
            updateSocketInfo(client);
        });
        
        // User logout from the system
        client.on('logout', function() {
            console.log(square[client.id].name + ' has logged out the session');
            updateSocketInfo(client);
            // Check if the user has a relationship with another customer. For example
            // if the user was talking.
        });
        
        // Peer to peer comunication system
        // @node: It is a json object that it has got roomuuid and message values.
        client.on('message', function(node) {
            console.log(node);
            client.broadcast.to(node.room).emit('message', node.message);
        });
            
    });
    
    // Update our web socket variables
    // @client: client socket object
    function updateSocketInfo(client){
        console.log('Web socket cleaned successfuly!');
        delete square[client.id];
        client.broadcast.emit('square-updated', square);
    };
    
    console.log('webRTC socket settings set up. Ready to listen!');
    return io;
}