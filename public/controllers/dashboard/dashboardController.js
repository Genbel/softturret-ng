'use strict';

define(['app'], function(app) {
    
    var injectParams = ['$rootScope','$location', 'authService', 'webRTCSocketService','modalService', '$q'];

    var DashboardController = function($rootScope, $location, authService, webRTCSocketService, modalService, $q) {
        
        var vm = this;
        vm.list = {};
        
        var socket = webRTCSocketService.socket;
        
        vm.username = webRTCSocketService.username;
        
        // Peer wants to start the call. It would be initiator
        // @socketId: Joiner socketId
        vm.callRequest = function(socketId, joiner) {
            webRTCSocketService.initiator = true;
            webRTCSocketService.remotePeerUsername = joiner;
            webRTCSocketService.remotePeerSId = socketId;
            $location.path('/webrtc');
        };
        
        // The future joiner receive the request that somebody wants to speak with.
        // @initiatorName
        socket.on('call-request', function(data) {
            modalService.show({},{}).then(function(result){
                if(result === 'ok'){
                    //updateServerSocket(data).then(function() {
                        webRTCSocketService.remotePeerUsername = data.initiator;
                        webRTCSocketService.uuid = data.uuid;
                        webRTCSocketService.remotePeerSId = data.sid;
                        socket.emit('call-accepted', data.sid);
                        $location.path('/webrtc');
                    //});
                } else {
                }
            });
        });
        
        // The call is successfully created so the initiator has to update the roomUUID
        // @roomID
        
        function updateServerSocket(data){
            
            var defer =  $q.defer();
            
            /*webRTCSocketService.initiatorUsername = data.initiator;
            webRTCSocketService.uuid = data.uuid;
            socket.emit('call-accepted');*/
            
            defer.resolve();
            
            return defer.promise;
        }
        
        // User logIn in the system.
        socket.emit('user-authenticated', vm.username);
        
        // There are changes in the square because somebody enter or quit.
        // @square: Updated info of the square.
        socket.on('square-updated', function(square){
            vm.list = square;
        });
        
        
        
        
        
        function init(){
            console.log(webRTCSocketService);
            //$rootScope.$broadcast('setAppLocation', 'Softturret dashboard');
        }
        
        init();
    };

    DashboardController.$inject = injectParams;

    app.register.controller('DashboardController', DashboardController);
});

/*function availableUsers() {
    if(Object.keys(vm.list).length > 0) {
        return true;
    } else {
        return false
    }
}*/