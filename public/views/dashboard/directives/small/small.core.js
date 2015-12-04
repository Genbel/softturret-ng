'use strict';

define(['app'], function(app){

    var injectParams = ['softturretSocketService'];

    var smallWidgetDirective = function(softturretSocketService){

        var socket = softturretSocketService.socket;

        var controller = function(){



            var vm = this;

            vm.addUserInChannel = function(buttonId, widgetId){
                socket.emit('kaixo', vm.widget);
                vm.addchanneluser()(buttonId, widgetId);
            };



        };

        var link = function(scope, elem, attrs, controller){

            console.log('WidgetId:' + controller.widget);

            scope.$on(scope.widget, function(){
                console.log('directive get the controller message');
            });

            var widgetId = controller.widget;
            //console.log(scope.$$listeners);

            function socketInit(){
                socket.forward(widgetId, scope);
                scope.$on('socket:'+ widgetId, function(){
                    console.log('kaixo node');
                });
            };

            socketInit();

            /*scope.$on('$destroy', function (event){
                socket.removeAllListeners();
            });*/

        }



        return {
            restrict: 'EA',
            controller: controller,
            // Our controller $scope will change for vm
            controllerAs: 'vm',
            // We set our widget info in the datasource.
            scope: {
                // After the configuration our datasource is accesible in the vm.datasource
                datasource: '=',
                addchanneluser: '&',
                widget: '@'
            },
            bindToController: true,
            link: link,
            templateUrl: '/angular-js/views/dashboard/directives/small/small.template.html'
        }


    };

    smallWidgetDirective.$inject = injectParams;

    app.directive('smallwidget', smallWidgetDirective);
});