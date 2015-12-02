'use strict';

var square = {};

// Register the user in the square
exports.addNewUserInTheSquare = function(socketId, user){
    square[socketId] = {"username" : user.username, "_id" : user._id };
    return square;
}

exports.getSquare = function(){
    return square;
};