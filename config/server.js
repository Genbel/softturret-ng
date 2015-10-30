'use strict';

// Get the database instance to connect to the db
// TIP: It has to be charged before express config, if not express config
// will throw some errors
var mongoose = require('./mongoose'),
    // Get the config file of the server
    express = require('./express'),
    passport = require('./passport'),
    q = require('q'),
    config = require('./config');

module.exports = function(){
    
    var thisObj = {
        db : null,
        server : null
    };
    // Database instance
    // It has to be before than express() creation
    mongoose().then(function(db){
        thisObj.db = db;
        express(config).then(function(settings) {
            var port = (config.server.enableHTTPS)? config.server.httpsPort : config.server.httpPort;
            //softturret.server.listen(port);
            settings.server.listen(8080, config.server.domain, function(){
                passport();
                console.log('Express server listening at ' + config.server.schema + '://' + config.server.domain + ':' + port + ' in ' + process.env.NODE_ENV + ' mode' );
            });
            
        });
    }).catch(function(err){
        console.log(err.name + ': ' + err.message);
    });
};