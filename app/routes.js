'use strict';

var usersCtrl = require('./controllers/users.server.controller'),
    path = require('path'),
    _ = require('underscore');

// Define all the routes of the app
var routes = [
    {
        path: '/',
        httpMethod: 'GET',
        middleware: [usersCtrl.renderSignin]
    },{
        path: '/login',
        httpMethod: 'POST',
        middleware: [usersCtrl.login]
    }
];
// Encapsulates app routes management code into a single unit of code
module.exports = function(app) {
    
    _.each(routes, function(route) {
        //route.middleware.unshift(ensureAuthorized);
        var args = _.flatten([route.path, route.middleware]);

        switch(route.httpMethod.toUpperCase()) {
            case 'GET':
                app.get.apply(app, args);
                break;
            case 'POST':
                app.post.apply(app, args);
                break;
            case 'PUT':
                app.put.apply(app, args);
                break;
            case 'DELETE':
                app.delete.apply(app, args);
                break;
            default:
                throw new Error('Invalid HTTP method specified for route ' + route.path);
                break;
        }
    });
};
    