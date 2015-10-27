'use strict';

// Load Mongoose 'User' model
var User = require('mongoose').model('User'),
    passport = require('passport');

var getErrorMessage = function(err) {
    // Define error message variable
    var message = '';
    
    // If mongoDB error occur get the message. That error is in the code variable
    if (err.code) {
        switch (err.code) {
            // If unique index error occur, configure error message
            case 11000:
            case 11001:
                message = 'User already exist';
                break;
            // If the error is general, configure
            default:
                message = 'An error has occurred!';
        }
    } else {
        // Store the error in the error list. We will get always the first error from the form.
        for (var errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message;
        }
    }
    
    // return error message
    return message;
};


// Renders the signin page
exports.renderSignin = function(req, res, next) {
    // If the user is not sign in render sign in page,
    // else render the root page
    /*if (!req.user) {
        // Use the response object to render the signin page
        res.render('signin', {
            // Configure the tile variable
            title: 'Sign-in Form',
            // Configure the flash message
            messages: req.flash('error') || req.flash('info')
        });
    } else {
        return res.redirect('/panel');
    }*/
    
    res.render('index');
};

exports.renderSignup = function(req, res) {
    res.render('signup');
};

exports.signup = function(req, res, next) {
    // The user is not connected, create and make login to the new user
    if (!req.user) {
        // Create new instance of the user
        // req.body: holds parameters that are sent up from the client as part of a POST request
        // The form input name and model atributes names has to be the same, if we want to add
        // correctly data in the collection
        var user = new User(req.body);
        var message = null;
        
        // Config the provider
        user.provider = 'local';
        // Save the new user
        user.save(function(err) {
            // There is an error, flash the erro
            if (err) {
                var message = getErrorMessage(err);
                // Configure the flash messages
                req.flash('error', message);
                // Redirect again to the signUp page
                return res.redirect('/signup');
            }
            // If the user was created correct, use the passport method to make the login
            // When the login operation completes, user will be assigned to req.user.
            /* Delete password and salt atributes. I cannot do because there is a serialize error
            user = user.toObject();
            delete user['password'];
            delete user.salt;*/
            req.login(user, function(err) {
                console.log("reqUser json" + req.user);
                // If there is an error logging go to the next middleware
                if (err) return next(err);
                // Redirect to the main page    
                return res.redirect('/panel');
            });
        });
    } else {
        return res.redirect('/');
    }
};

exports.renderPanel = function(req, res) {
    res.render('index');
};

// METHOD: POST
// Make the login of the user.
exports.login = function(req, res, next){

    passport.authenticate('local', function(err, user, message) {
        
        // Error in the local strategy
        if(err)     { return next(err); }
        // If we don't find the proper user
        // We could use also 'BadRequest' respond 400
        // res.sendStatus(400)
        if(!user)   { return res.status(200).json({ "message" : message, "authenticated": false }); }
        // We find the user so log manually with passport and send back the message to the client
        req.login(user, function(err) {
            // Some error in the manual login
            if(err) {
                return next(err);
            }
            // Send back the message
            res.status(200).json({"username": user.username, "authenticated": true});
        });
    })(req, res, next);
    
}
    
    