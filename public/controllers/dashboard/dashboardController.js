'use strict';

define(['app'], function(app) {
    
    var injectParams = ['$location', 'authService', 'webRTCSocketService'];

    var DashboardController = function($location, authService, webRTCSocketService) {
        
        var socket = webRTCSocketService.socket;
        
        //socket.connect();
        
        socket.emit('welcome', webRTCSocketService.username);
        
        socket.on('Hi', function(){
            console.log('You get good feed back from the server');
        });
        
    };

    DashboardController.$inject = injectParams;

    app.register.controller('DashboardController', DashboardController);
});