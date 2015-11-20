'use strict';
var usersCtrl = require('./controllers/users.server.controller'),
    widgetsCtrl = require('./controllers/widgets.server.controller'),
    path = require('path'),
    _ = require('underscore');

// Define all the routes of the app
var routes = [
    // WARNING: IN SOME REQUEST WE NEED A requiresLogin function as middleware
    {
        path: '/',
        httpMethod: 'GET',
        middleware: [usersCtrl.renderIndex]
    },{
        path: '/api/dataservice/login',
        httpMethod: 'POST',
        middleware: [usersCtrl.login]
    },{
        path: '/api/dataservice/logout',
        httpMethod: 'POST',
        middleware: [usersCtrl.logout]
    },{
        path: '/api/dataservice/signup',
        httpMethod: 'POST',
        middleware: [usersCtrl.signup]
    },{
        path:'/api/dataservice/widget/create',
        httpMethod:'POST',
        middleware: [widgetsCtrl.addWidget]
    }
];
// Encapsulates app routes management code into a single unit of code
module.exports = function(app) {
    
    _.each(routes, function(route) {
        // We can work on that later
        // route.middleware.unshift(ensureAuthorized);
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
    