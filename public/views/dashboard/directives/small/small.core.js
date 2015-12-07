'use strict';

define(['app'], function(app){

    var injectParams = ['softturretSocketService'];

    var smallWidgetDirective = function(softturretSocketService){

        var socket = softturretSocketService.socket;

        var controller = function(){



            var vm = this;

            vm.buttons = vm.datasource.buttons;

            vm.addUserInChannel = function(buttonId, widgetId){
                socket.emit('kaixo', vm.widget);
                vm.addchanneluser()(buttonId, widgetId);
            };



        };

        var link = function(scope, elem, attrs, controller){

            console.log('WidgetId:' + controller.widget);

            //564da36fe801c57c031756d3
            /*elem.on('click', function(e){
                console.log(angular.element(elem[0].querySelectorAll("[data-id='564da36fe801c57c031756d3']")).addClass("connected"));
                console.log(angular.element(elem[0].querySelectorAll("[data-id='564da36fe801c57c031756d3'] > .light")).addClass("blink-red"));
            })*/

            /*elem.on('click', function(e){
                //console.log(angular.element(elem[0].querySelectorAll(".widget-btn")));
                console.log(elem[0].querySelector('.widget-btn'));
                //console.log(angular.element(elem[0].getElementsByClassName('.widget-btn')));
                angular.element(elem[0].querySelectorAll('.widget-btn')).on('click', function(){
                    console.log('click clik querySelector');
                });
            });*/
            angular.element(elem[0].querySelectorAll('.widget-btn')).on('click', function(){
                console.log('click');
            });

            /*elem[0].getElementk');
            });*/

            /*var by = elem[0].getElementsByClassName('widget-btn');
            console.log(angular.element('div'));*/

            /*angular.element(elem[0].querySelectorAll('.widget-btn')).on('click', function(){
                console.log('click querySelector');
            });*/


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
            restrict: 'AE',
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
            templateUrl: '/angular-js/views/dashboard/directives/small/small.template.html',
            link: link,
        }


    };

    smallWidgetDirective.$inject = injectParams;

    app.directive('smallwidget', smallWidgetDirective);
});