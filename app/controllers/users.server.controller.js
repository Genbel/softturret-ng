'use strict';

// Load Mongoose 'User' model
var User = require('mongoose').model('User'),
    passport = require('passport');

// Renders the signin page
exports.renderIndex = function(req, res) {

    res.render('index');
}

exports.signup = function(req, res, next) {
    // Create new instance of the user
    // req.body: holds parameters that are sent up from the client as part of a POST request
    // The form input name and model atributes names has to be the same, if we want to add
    // correctly data in the collection
    var user = new User(req.body);

    // Save the new user
    user.save(function(err) {
        // There is an error, flash the error
        if (err) { 
            return res.status(200).json({"type": "db", "message" : getErrorMessage(err)});
        }
        // If the user was created correct, use the passport method to make the login
        // When the login operation completes, user will be assigned to req.user.
        req.login(user, function(err) {
            // If there is an error logging go to the next middleware
            if (err) res.status(200).json({"type": "login", "message" : "The system couldn't do the auto-login."});
            // Send back the message
            return res.status(200).json({"type": "login-ok", "message" : "The system couldn't do the auto-login."});
        });
    });
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
            next();
        });
    })(req, res, next);
    
}

// Crear un nuevo método controller para signing out
exports.logout = function(req, res) {
    // Usa el método 'logout' de Passport para hacer logout
    req.logout();
    // Send back the respond
    res.status(200).json({"message":"Successful logout"});
};

// Crear un nuevo middleware controller que es usado para autorizar operaciones de autentificación 
exports.requiresLogin = function(req, res, next) {
  // Si un usuario no está autentificado envía el mensaje de error apropiado
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      message: 'User is not authenticated'
    });
  }

  // Llamar al siguiente middleware
  next();
};



var getErrorMessage = function(err) {
    // Define error message variable
    var message = '';
    
    // If mongoDB error occur get the message. That error is in the code variable
    if (err.code) {
        switch (err.code) {
            // If unique index error occur, configure error message
            case 11000:
            case 11001:
                message = 'Duplicate key: Username or company already exist';
                break;
            // If the error is general, configure
            default:
                message = 'An error has occurred while saving!';
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
    
    