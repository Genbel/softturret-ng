'use strict'

var mysql = require('mysql'),
    config = require('./config'),
    Q = require('q'),
    _ = require('underscore');

module.exports = function(){

    var deferred = Q.defer();

    var setUpMySQLPoolConnection = function(){

        // A connection pool is a cache of database connections maintained so that
        // the connections can be reused when future requests to the database are required

        var pool = mysql.createPool({
            host: config.mySQLdb.host,
            user: config.mySQLdb.username,
            password: config.mySQLdb.password,
            database: config.mySQLdb.dbName,
            port: config.mySQLdb.port,
            socketPath: config.mySQLdb.socketPath
        });

        deferred.resolve(pool);

        /*pool.getConnection(function(err, connection){
            if(err){
                console.error('error connecting: ' + err.stack);
                deferred.reject(err);
            }else {
                console.log('MySQL default connection open with ' + connection.threadId + ' id');
                connection.query('SELECT * FROM AdditionalServices', function(error, rows){
                    _.each(rows, function(row){
                        console.log(row.Name);
                    });
                });
                deferred.resolve(connection);
            }
            connection.on('error', function(err) {
                if(err.code === 'PROTOCOL_CONNECTION_LOST'){
                    console.log('MySQL default connection has been disconnected');
                    connection.destroy();
                }
            });
        });*/
    };

    // Create a connection pool for better maintenance
    setUpMySQLPoolConnection();

    return deferred.promise;
}