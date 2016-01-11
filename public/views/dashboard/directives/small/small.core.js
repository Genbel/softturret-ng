'use strict';

define(['app'], function(app){

    var injectParams = ['softturretSocketService'];

    var smallWidgetDirective = function(softturretSocketService){

        var socket = softturretSocketService.socket;

        var controller = ['$scope', function ($scope) {

            var vm = this;

            vm.buttons = vm.datasource.buttons;

            var widgetId = vm.widgetId;

            // Store all the sockets events in the scope

            vm.mouseDownEvent = function(bEnd){
                socket.emit('small-widget-mouse-down', bEnd);
            };

            vm.mouseUpEvent = function(bEnd){
                socket.emit('small-widget-mouse-up', bEnd);
            };



        }];

        var link = function(scope, elem, attrs, controller){

            var widgetId = controller.widget;

            scope.$on(widgetId, function(event, data, state){
                if(state == "speak-in"){
                    angular.element(elem[0].querySelectorAll("[data-id='" + data + "'] > .light")).addClass("blink-red");
                } else {
                    angular.element(elem[0].querySelectorAll("[data-id='" + data + "'] > .light")).removeClass("blink-red");
                }
            });

            /*scope.$on('$destroy', function (event){
                socket.removeAllListeners();
            });*/

        }



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