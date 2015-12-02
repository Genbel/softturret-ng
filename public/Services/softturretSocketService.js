'use strict';

define(['app'], function(app){
    
    var injectParams = ['socketFactory'];
    
    var softturretSocketFactory = function(socketFactory){
        var factory = {
            socket: socketFactory()
        };
        
        return factory;
    };

    softturretSocketFactory.$inject = injectParams;
    
    app.factory('softturretSocketService', softturretSocketFactory);
    
});