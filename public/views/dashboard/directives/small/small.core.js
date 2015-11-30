'use strict';

define(['app'], function(app){

    var injectParams = [];

    var smallWidgetDirective = function(){

        var controller = ['$scope', function($scope){

            var vm = this;

            console.log(vm.datasource);
        }];

        return {
            restrict: 'E',
            controller: controller,
            // Our controller $scope will change for vm
            controllerAs: 'vm',
            // We set our widget info in the datasource.
            scope: {
                // After the configuration our datasource is accesible in the vm.datasource
                datasource: '='
            },
            bindToController: true,
            templateUrl: '/angular-js/views/dashboard/directives/small/small.template.html'
        }
    };

    app.directive('smallwidget', smallWidgetDirective);
});