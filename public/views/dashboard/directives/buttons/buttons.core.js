'use strict';

define(['app'], function(app){

    var injectParams = ['softturretSocketService'];

    var buttonsDirective = function(softturretSocketService){

        var socket = softturretSocketService.socket;

        var link = function(scope, elem, attrs, controller){

            //console.log(controller.widget);

            angular.element(elem[0].querySelectorAll('.kaixo')).on('click', function(){
                console.log('click london!!');
            });

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

        };

        var controller = function(){

            var vm = this;

            vm.addUserInChannel = function(buttonId, widgetId){
                socket.emit('kaixo', vm.widget);
                vm.addchanneluser()(buttonId, widgetId);
            };



        };



        return {
            restrict: 'AE',
            controller: controller,
            controllerAs: 'vm',
            bindToController: true,
            // We set our widget info in the datasource.
            scope: {
                datasource: '=',
                addchanneluser: '&',
                widget: '@'
            },
            templateUrl: '/angular-js/views/dashboard/directives/buttons/buttons.template.html',
            link: link,
        }


    };

    buttonsDirective.$inject = injectParams;

    app.directive('buttonswidget', buttonsDirective);

});