// As default will be development environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Get the database instance to connect to the db
// TIP: It has to be charged before express config, if not express config
// will throw some errors
var mongoose = require('./config/mongoose');
// Get the config file of the server
var express = require('./config/express');
var passport = require('./config/passport');
// Database instance
// It has to be before than express() creation
var db = mongoose();
// Server instance
var app = express();
var passport = passport();

app.listen(8080);
console.log('Server listening in port 8080...');
// Encapsulates express app instance code into a single unit of code for an external use
module.exports = app;