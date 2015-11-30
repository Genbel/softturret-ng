'use strict';

define(['app'], function(app) {
    
    var injectParams = ['$scope', '$rootScope','$location', 'authService', 'webRTCSocketService', 'widgetsRestfulFactory', 'modalService'];

    var DashboardController = function($scope, $rootScope, $location, authService, webRTCSocketService, widgetsRestfulFactory, modalService) {
        
        var vm = this;
            vm.smallWidgets = null;

        
        var socket = webRTCSocketService.socket;
        
        webRTCSocketService.username = authService.user.name;

        vm.createSmallWidget = function(){
            widgetsRestfulFactory.createWidget( { type: 'small'} )
                .then(function(msg){
                    vm.smallWidgets = msg.data.widgets.small;
                });
        };

        vm.addUser = function(buttonId, widgetId){

            modalService.show({},{}, buttonId, widgetId).then(function(result) {
                if (result === 'ok') {
                }
            });
        };

        $scope.$on('$destroy', function(){
            socket.removeListener();
        });

        $scope.$on('user-config-updated', function(event, args){
            vm.smallWidgets = args;
        });

        function init() {
            if(widgetsRestfulFactory.config !== null){
                vm.smallWidgets = widgetsRestfulFactory.config.small;
            }
        };

        init();
    };

    DashboardController.$inject = injectParams;

    app.register.controller('DashboardController', DashboardController);
});