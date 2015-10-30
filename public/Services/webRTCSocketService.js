'use strict';

define(['app'], function(app){
    
    var injectParams = ['socketFactory'];
    
    var webRTCSocketFactory = function(socketFactory){
        
        var factory = {
            socket: socketFactory(),
            username: null
        }
        return factory;
    };
    
    webRTCSocketFactory.$inject = injectParams;
    
    app.factory('webRTCSocketService', webRTCSocketFactory);
    
});