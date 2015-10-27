var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('mongoose').model('User');

module.exports = function() {
    // It has, 'done' callback when we finish with the proccess
    passport.use(new LocalStrategy ( function(username, password, done) {
        // Find our user by name
        User.findOne({
            username: username
        // If the operation has a error send
        }, function(err, user) {
            if(err){
                return done(err);
            }
            // If that username doesn't exist
            if(!user) {
                return done( null, false, 'Incorrect user');
            }
            // If the user password is wrong
            if(!user.authenticate(password)) {
                return done(null, false, 'Incorrect password' );
            }
            // Return our user to make the login
            return done(null, user);
        });
    }));
};