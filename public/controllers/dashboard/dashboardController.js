'use strict';

define(['app'], function(app) {
    
    var injectParams = ['$scope', '$rootScope','$location', 'authService', 'softturretSocketService', 'widgetsRestfulFactory', 'modalService'];

    var DashboardController = function($scope, $rootScope, $location, authService, softturretSocketService, widgetsRestfulFactory, modalService) {

        var vm = this;
        vm.smallWidgets = null;

        var socket = softturretSocketService.socket;
        // Control our talking button
        var localLatchButton = {"widgetId" : null, "licenceId" : null, "remoteEndId" : null};

        function init() {
            // Send the user object to the server to register in the socket
            socket.emit('user-connected', widgetsRestfulFactory.user);
        };

        init();
        
        //webRTCSocketService.username = authService.user.name;

        // -----------------------------------------------------------
        //  --------- Set up controller functions---------------------
        // -----------------------------------------------------------

        vm.createSmallWidget = function(){
            modalService.show({},{}).then(function(result) {
                if (result === 'ok') {
                    vm.smallWidgets = widgetsRestfulFactory.softConfig.small;
                }
            });
        };

        // ------------------------------------------------------------
        //  --------- Set up socket functionality ---------------------
        // ------------------------------------------------------------

        // Set up socket listener to the scope, like this it will not duplicate the listeners
        socket.forward('square-info', $scope);
        // Blink or unblink action for the button
        socket.forward('blink', $scope);

        // Create or update the data structures
        // @square: square or user info data
        // @state: user life cycle
        $scope.$on('socket:square-info', function(event, square, state){
            // Create new hash table for connected users
            if(widgetsRestfulFactory.softConfig !== null){
                // The user just logged so it has to set up the configuration
                if(state === 'set-up'){
                    // Initiate all the data structures ready to start
                    widgetsRestfulFactory.addConnectStateToWidgets(square);
                    vm.smallWidgets = widgetsRestfulFactory.softConfig.small;
                // The user get the notification(state) that one user it has logged or left
                } else {
                    widgetsRestfulFactory.updateWidgetConfiguration(square, state);
                }

            }
        });

        $scope.$on('socket:blink', function(event, data){
                var licence = widgetsRestfulFactory.userHashMap.get(data.remoteEndId)[data.licenceId];
                $scope.$broadcast(licence.widgetId + ":blink", data);

        });

        // ----------------------------------------------------------------------------------
        // ------- $broadcast/$on/$emit communication, between controller and directives ----
        // ----------------------------------------------------------------------------------

        $scope.$on('unlatch-event', function(event, latchToken, remoteEndId, sameWidget){
            // Do not switch off any button light because all the buttons are switch off
            // If one button is latch, unlatch

            if(localLatchButton.licenceId != null){
                // If is in the same widget we already did that, so skip
                if(sameWidget) {
                    $scope.$broadcast(localLatchButton.widgetId + ":unlatch", localLatchButton.licenceId);
                }
                // Prepere the token to send the remoteUser
                var remoteToken = {
                    "remoteEndId"  : localLatchButton.remoteEndId,
                    "licenceId"     : localLatchButton.licenceId,
                    "action"        : "unblink"
                };
                socket.emit('remote-peer-lighting', remoteToken);
            }

            // Update the latched button variable
            localLatchButton = {
                "widgetId"      : latchToken.widgetId,
                "licenceId"     : latchToken.licenceId,
                "remoteEndId"   : remoteEndId
            };
        });

        // -----------------------------------------------------------------------------
        // --------- Set up methods related with the scope of the controller -----------
        // -----------------------------------------------------------------------------

        $scope.$on('$destroy', function(){
            socket.removeListener();
        });
    };

    DashboardController.$inject = injectParams;

    app.register.controller('DashboardController', DashboardController);
});

/*onsole.log(elem(elem[0].querySelectorAll("[data-id='564da36fe801c57c031756d3']")).attr("class","connected"));*/