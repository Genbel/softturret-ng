'use strict';

define(['app'], function(app) {
    
    var injectParams = ['$scope', '$rootScope','$location', 'authService', 'webRTCSocketService','modalService', '$q'];

    var DashboardController = function($scope, $rootScope, $location, authService, webRTCSocketService, modalService, $q) {
        
        var vm = this;
        vm.list = {};
        
        var socket = webRTCSocketService.socket;
        
        webRTCSocketService.username = authService.user.name;
        
        vm.username = webRTCSocketService.username;
        
        // There are changes in the square because somebody enter or quit.
        // @square: Updated info of the square.
        socket.on('square-updated', function(square){
            vm.list = square;
        });
        
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
                    updateServerSocket(data).then(function() {
                        $location.path('/webrtc');
                    });
                } else {
                }
            });
        });
        
        // The call is successfully created so the initiator has to update the roomUUID
        // @roomID
        
        function updateServerSocket(data){
            
            var defer =  $q.defer();
            
            webRTCSocketService.remotePeerUsername = data.initiator;
            webRTCSocketService.uuid = data.uuid;
            webRTCSocketService.remotePeerSId = data.sid;
            socket.emit('call-accepted', data.sid);
            
            defer.resolve();
            
            return defer.promise;
        }
        
        
        
        
        
        
        
        function init(){
            // User logIn in the system.
            socket.emit('user-authenticated', vm.username);
        }
        
        init();
        
        $scope.$on('$destroy', function(){
            socket.removeListener();
        });
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