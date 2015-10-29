'use strict';

define(['app'], function(app) {
    
    var injectParams = ['$location', 'authService'];

    var LoginController = function($location, authService) {
        
        var vm = this;
        
        vm.username = null;
        vm.password = null;
        vm.errorMessage = null;

        vm.login = function() {
            authService.login({username: vm.username, password: vm.password})
                .then(function(status){
                    if(!status.authenticated){
                        console.log(status.message);
                        vm.errorMessage = status.message;
                    }else{
                        $location.path('/dashboard');
                    }
                }
                ,function(status){
                    $scope.errorMessage = 'HTTP error, status: ' + status.status + '. ' + status.data;
                })
            ;
        };
    };

    LoginController.$inject = injectParams;
    // We add controller like this because we do dinamically
    app.register.controller('LoginController', LoginController);
});
    