'use strict';

define(['app'], function(app) {
    
    var injectParams = ['$scope', '$rootScope','$location', 'authService', 'webRTCSocketService', 'restfulFactory'];

    var DashboardController = function($scope, $rootScope, $location, authService, webRTCSocketService, restfulFactory) {
        
        var vm = this;
        
        var socket = webRTCSocketService.socket;
        
        webRTCSocketService.username = authService.user.name;

        vm.createSmallWidget = function(){
            restfulFactory.createWidget( { type: 'small'} )
                .then(function(msg){
                    console.log(msg);
                });
        };

        $scope.$on('$destroy', function(){
            socket.removeListener();
        });
    };

    DashboardController.$inject = injectParams;

    app.register.controller('DashboardController', DashboardController);
});