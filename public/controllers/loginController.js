"use strict";

define(['app'], function(app) {
    
    var injectParams = ['$location', 'authService'];

    var LoginController = function($location, authService) {
        
        var vm = this;
        
        vm.username = null;
        vm.password = null;
        vm.errorMessage = null;
        
        // Login the user in the system.
        vm.login = function() {
            
            authService.user.name = vm.username;
            // Use our authentication service to login the user using RESTFul protocol
            authService.login({username: vm.username, password: vm.password})
                .then(function(status){
                    if(!status.authenticated){
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
    