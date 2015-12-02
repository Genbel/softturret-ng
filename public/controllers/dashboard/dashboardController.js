'use strict';

define(['app'], function(app) {
    
    var injectParams = ['$scope', '$rootScope','$location', 'authService', 'softturretSocketService', 'widgetsRestfulFactory', 'modalService'];

    var DashboardController = function($scope, $rootScope, $location, authService, softturretSocketService, widgetsRestfulFactory, modalService) {

        var vm = this;
        vm.smallWidgets = null;

        var socket = softturretSocketService.socket;

        function init() {
            socket.emit('user-connected', widgetsRestfulFactory.user);
            if(widgetsRestfulFactory.config !== null){
                vm.smallWidgets = widgetsRestfulFactory.config.small;
            }
        };

        init();
        
        //webRTCSocketService.username = authService.user.name;

        //  --------- Set up controller functions---------------------

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

        // --------- Set up methods related with the scope of the controller -----------

        $scope.$on('$destroy', function(){
            socket.removeListener();
        });

        $scope.$on('user-config-updated', function(event, args){
            vm.smallWidgets = args;
        });

        //  --------- Set up socket functionality ---------------------

        socket.on('square-updated', function(square){
            console.log('square-updated');
            console.log(square);
        });
    };

    DashboardController.$inject = injectParams;

    app.register.controller('DashboardController', DashboardController);
});