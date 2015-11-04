'use strict';

define(['app'], function(app){
    
    var injectParams = ['socketFactory'];
    
    var webRTCSocketFactory = function(socketFactory){
        console.log('Socket factory');
        var factory = {
            socket: socketFactory(),
            username: null,
            initiator: false,
            joinerUsername: null,
            remotePeerSId: null,
            remotePeerUsername: null,
            uuid: null,
            
            
        };
        
        return factory;
    };
    
    webRTCSocketFactory.$inject = injectParams;
    
    app.factory('webRTCSocketService', webRTCSocketFactory);
    
});