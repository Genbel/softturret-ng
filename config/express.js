var config = require('./config'), // config file. It seems we don't need to add the extension
    session = require('express-session'),
    express = require('express'),
    morgan = require('morgan'),
    //compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    passport = require('passport'),
    flash = require('connect-flash');

// Encapsulates express application configuration code into a single unit of code
module.exports = function() {

	var app = express();
    // Set the environment
	if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }
    
    /*// In production don't do that
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }*/
    
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    // Get the request body data: req.body
    app.use(bodyParser.json());
    // Let has to add PUT and DELETE http calls
    app.use(methodOverride());
    // That object will add to all request object, one session object.
    // With that we will have complete session control
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));
    // Set our view folder
    app.set('views', './app/views');
    // Set our template engine
    app.set('view engine', 'ejs');
    
    // To flash messages
    app.use(flash());
    // Middleware
    // To inialize the passport module
    app.use(passport.initialize());
    // It will use express session to maintain all info about user session
    app.use(passport.session());
    
    require('../app/routes.js')(app);
    // Add middleware to serve static files. 
    // Set the location of that files
    // It has to be always down the routes require
    // Like this in the view we will put only the src that has in public
    // The first arg is the how we want to name that folder, second one the path
    app.use('/3rd-party-js',express.static('./Scripts'));
    app.use('/angular-js', express.static('./public'));
    app.use('/content', express.static('./Content'));
    
    
    return app;

};