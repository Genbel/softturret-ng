'use strict';

define(['app'], function(app){

    var injectParams = ['softturretSocketService'];

    var smallWidgetDirective = function(softturretSocketService){

        var socket = softturretSocketService.socket;

        var controller = function(){



            var vm = this;

            console.log('Controller widget: ' + vm.widget);

            vm.addUserInChannel = function(buttonId, widgetId){
                console.log(widgetId);
                socket.emit('kaixo', vm.widget);
                vm.addchanneluser()(buttonId, widgetId);
            };



        };

        var link = function(scope, elem, attrs, controller){

            var widgetId = controller.widget;
            console.log(scope.$$listeners);

            function socketInit(){
                if(scope.$$listeners['kaixo-node']){
                    console.log('it has listeneers');
                } else {
                    console.log('it has not listeners');
                }
                socket.forward(widgetId, scope);
                scope.$on('socket:'+ widgetId, function(){
                    console.log('kaixo node');
                });
                if(scope.$$listeners['socket:kaixo-node']){
                    console.log('it has listeneers');
                } else {
                    console.log('it has not listeners');
                }
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