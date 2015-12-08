'use strict';

var _ = require("underscore");
var square = {};

// Register the user in the square
exports.addNewUserInTheSquare = function(socketId, user){
    square[user._id] = {"socketId" : socketId };
    return square;
}

// The user disconnect from the socket so we need to clean the square
exports.eraseUserFromTheSquare = function(socketId){
    var userId = null;
    _.find(square, function(node, index){
        if(node.socketId === socketId){
            userId = index;
            delete square[index];
            // It returns the actual node by default
            // In that case we need the index so we don't care the return
            return;
        }
    });
    return { "socketId" : socketId, "userId": userId};
}

exports.getConnectionData = function(userId, aEndSocketId){
    var aEndUserId = null;
    _.find(square, function(node, index){
        if(node.socketId === aEndSocketId){
            aEndUserId = index;
            // It returns the actual node by default
            // In that case we need the index so we don't care the return
            return;
        }
    });

    var data = { "bEndSocketId" : square[userId].socketId, "aEndUserId" : aEndUserId };

    return data;
}

exports.getSquare = function(){
    return square;
};