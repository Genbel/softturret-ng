'use strict';

// Get the database instance to connect to the db
// TIP: It has to be charged before express config, if not express config
// will throw some errors
var mongoose = require('./mongoose'),
    tvaDB = require('./tva'),
    // Configure the express server, set up the server in others words
    express = require('./express'),
    passport = require('./passport'),
    q = require('q'),
    // Get the actual environment configuration file, development or production
    config = require('./config');

module.exports = function(){

    var thisObj = {
            mongodb : null,
            mysqlPooldb: null,
            server : null
    };
    // Database instance
    // It has to be before than express() creation
    // Open the database connection


    mongoose().then(function(softturretdb){
        thisObj.mongodb = softturretdb;
        tvaDB().then(function(tvadb){
            console.log("MySQL default Pool connection created!");
            thisObj.mysqlPooldb = tvadb;
            // Create express server depending of the config file
            express(config).then(function(settings) {
                var port = (config.server.enableHTTPS)? config.server.httpsPort : config.server.httpPort;
                // Put the server listening in the port
                settings.server.listen(8080, config.server.domain, function(){
                    passport();
                    console.log('Express server listening at ' + config.server.schema + '://' + config.server.domain + ':' + port + ' in ' + process.env.NODE_ENV + ' mode' );
                });

            });
        }).catch(function(err){
            console.log(err);
        });
    }).catch(function(err){
        console.log(err.name + ': ' + err.message);
    });
    return thisObj;
};