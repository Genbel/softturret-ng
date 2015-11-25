'use strict';

var passport = require('passport'),
    mongoose = require('mongoose');

module.exports = function() {
    var User = mongoose.model('User');
    
    // Only the user ID is serialized to the session,
    // keeping the amount of data stored within the session small.
    passport.serializeUser(function(user, done) {
        done(null, user.id)
    });
    
    // When subsequent requests are received, this ID is used 
    // to find the user, which will be restored to req.user
    passport.deserializeUser(function(id, done) {
        User.findOne({
            _id: id,
        // add mongoose options in findOne function.
        // In that case is to not get that variables
        }, '-password -salt -widgets', function(err, user) {
            done(err, user);
        });
    });
    
    require('./strategies/local.js')();
}