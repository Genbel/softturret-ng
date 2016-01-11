// As default will be development environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development';


var server = require('./config/server');

var app = server();

module.exports = function(){
    return app;
}