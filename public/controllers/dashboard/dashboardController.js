'use strict';

define(['app'], function(app) {
    
    var injectParams = ['$scope', '$rootScope','$location', 'authService', 'softturretSocketService', 'widgetsRestfulFactory', 'modalService'];

    var DashboardController = function($scope, $rootScope, $location, authService, softturretSocketService, widgetsRestfulFactory, modalService) {

        var vm = this;
        vm.smallWidgets = null;

        var socket = softturretSocketService.socket;

        function init() {
            // Send the user object to the server to register in the socket
            socket.emit('user-connected', widgetsRestfulFactory.user);
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

        //  --------- Set up socket functionality ---------------------

        // Set up socket listener to the scope, like this it will not duplicate the listeners
        socket.forward('square-info', $scope);

        // Create or update the data structures
        // @square: square or user info data
        // @state: user life cycle
        $scope.$on('socket:square-info', function(event, square, state){
            // Create new hash table for connected users
            if(widgetsRestfulFactory.config !== null){
                // The user just logged so it has to set up the configuration
                if(state === 'set-up'){
                    // Initiate all the data structures ready to start
                    widgetsRestfulFactory.addConnectStateToWidgets(square);
                    vm.smallWidgets = widgetsRestfulFactory.config.small;
                // The user get the notification(state) that one user it has logged or left
                } else {
                    //$scope.$broadcast('kaixo');
                    widgetsRestfulFactory.updateWidgetConfiguration(square, state);
                }

            }
        });

        // --------- Set up methods related with the scope of the controller -----------

        $scope.$on('$destroy', function(){
            socket.removeListener();
        });

        $scope.$on('user-config-updated', function(event, args){
            vm.smallWidgets = args;
        });
    };

    DashboardController.$inject = injectParams;

    app.register.controller('DashboardController', DashboardController);
});

/*onsole.log(elem(elem[0].querySelectorAll("[data-id='564da36fe801c57c031756d3']")).attr("class","connected"));*/