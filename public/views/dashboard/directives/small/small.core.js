'use strict';

define(['app'], function(app){

    var injectParams = ['softturretSocketService'];

    var smallWidgetDirective = function(softturretSocketService){

        var socket = softturretSocketService.socket;

        var controller = ['$scope', function ($scope) {

            var vm = this;
            // To know if the latched button is in that widget: null or licenceId might have.
            vm.widgetLatchedButton = null;

            vm.buttons = vm.datasource.buttons;

            var widgetId = this.widget;

            // Store all the sockets events in the scope

            vm.talk = function(bEnd){
                var licenceId = this.buttons[bEnd-1].licenceId;
                var remoteEndId = this.buttons[bEnd-1].remoteUserId;
                // This token we will use to send info to the socket and after remoteUser
                var remoteTalkToken = {"licenceId" : licenceId, "remoteEndId" : remoteEndId, "action" : "unblink"};
                // The token that will update the local dashboard variable
                var latchToken = {"licenceId" : licenceId, "widgetId" : widgetId};
                // Send a message another widget because is not here the latched button
                var emitAnotherWidget = true;
                // To know if we click in the same button
                var unLatchSameButton = false;

                // The latched button is in that widget so unlatch locally
                if(vm.widgetLatchedButton != null){
                    emitAnotherWidget = false;
                    //console.log(vm.widgetLatchedButton);
                    if(vm.widgetLatchedButton == licenceId){
                        unLatchSameButton = true;
                        latchToken = {"widgetId" : null, "licenceId" : null};
                    }
                    $scope.unlatchButton(vm.widgetLatchedButton);
                }
                // The latched button is in another widget so broadcast this to the main controller
                $scope.$emit('unlatch-event', latchToken, remoteEndId, emitAnotherWidget);

                // Activate clicked button blinking green
                // Also light the remote peer of that button
                if(!unLatchSameButton){
                    $scope.addLatchState(licenceId);
                    remoteTalkToken["action"] = "blink";
                    socket.emit('remote-peer-lighting', remoteTalkToken);
                }
            };
        }];

        var link = function(scope, elem, attrs, controller){

            var widgetId = controller.widget;

            // -------------------------------------------------------------------------
            // -------- REMOTE WIDGET lighting actions. It depends in user actions -----
            // -------------------------------------------------------------------------

            // Control socket message back to blink red light and unblink the
            scope.$on(widgetId + ":blink", function(event, data){
                if(data.action == "blink"){
                    angular.element(elem[0].querySelectorAll("[data-id='" + data.licenceId + "'] > .light")).addClass("blink-red");
                } else {
                    angular.element(elem[0].querySelectorAll("[data-id='" + data.licenceId + "'] > .light")).removeClass("blink-red");
                }
            });

            // ------------------------------------------------------------------------
            // -------- LOCAL WIDGET lighting actions. It depends in user actions -----
            // ------------------------------------------------------------------------

            scope.$on(widgetId + ":unlatch", function(event, licenceId){
                scope.unlatchButton(licenceId);
            });

            scope.addLatchState = function(licenceId){
                latchButton(licenceId);
            };

            scope.unlatchButton = function(licenceId){
                angular.element(elem[0].querySelectorAll("[data-id='" + licenceId + "'] > .light")).removeClass("blink-green");
                angular.element(elem[0].querySelectorAll("[data-id='" + licenceId + "']")).removeClass("push");
                controller.widgetLatchedButton = null;
            };

            var latchButton = function(licenceId){
                angular.element(elem[0].querySelectorAll("[data-id='" + licenceId + "'] > .light")).addClass("blink-green");
                angular.element(elem[0].querySelectorAll("[data-id='" + licenceId + "']")).addClass("push");
                controller.widgetLatchedButton = licenceId;
            };
        };



        return {
            restrict: 'AE',
            controller: controller,
            // Our controller $scope will change for vm
            controllerAs: 'vm',
            // We set our widget info in the datasource.
            scope: {
                // After the configuration our datasource is accesible in the vm.datasource
                datasource: '=',
                widget: '@'
            },
            bindToController: true,
            templateUrl: '/angular-js/views/dashboard/directives/small/small.template.html',
            link: link,
        }


    };

    smallWidgetDirective.$inject = injectParams;

    app.directive('smallwidget', smallWidgetDirective);
});