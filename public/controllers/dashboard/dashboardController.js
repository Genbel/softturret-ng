'use strict';

define(['app'], function(app) {
    
    var injectParams = ['$location', 'authService'];

    var DashboardController = function($location, authService) {
        
        var vm = this;
        
        vm.yes = 'Gematech.com';
    };

    DashboardController.$inject = injectParams;

    app.register.controller('DashboardController', DashboardController);
});