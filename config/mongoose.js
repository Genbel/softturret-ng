'use strict';

var config = require('./config'),
    mongoose = require('mongoose'),
    Q = require('q');

module.exports = function() {
    
    var deferred = Q.defer();
    
    var setupConfiguration = function() {
        
        var connection = 'mongodb://'+ config.db.username +':'+ config.db.password +'@' + config.db.host + ':'+ config.db.port +'/'+ config.db.dbName;
    
        var db = mongoose.connect(connection);

        // Charge our models: User and widget
        require('../app/models/user.server.model.js');
        require('../app/models/widget.server.model.js');

        // CONNECTION EVENTS
        // When successfully connected
        db.connection.on('connected', function () {
            deferred.resolve(db);
            console.log('Mongoose default connection open');
        }); 

        // If the connection throws an error
        db.connection.on('error',function (err) {
            deferred.reject(err);
        }); 

        // When the connection is disconnected
        db.connection.on('disconnected', function () {  
          console.log('Mongoose default connection disconnected'); 
        });

        // If the Node process ends, close the Mongoose connection 
        process.on('SIGINT', function() {  
          db.connection.close(function () { 
            console.log('Mongoose default connection disconnected through app termination'); 
            process.exit(0); 
          }); 
        });
        return db;
    };
    
    setupConfiguration();
    
    // Return the mongoose database instance
    return deferred.promise;
};