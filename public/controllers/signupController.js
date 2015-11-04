'use strict';

define(['app'], function(app) {
    
    var injectParams = ['$location', 'authService'];
    
    var SignupController = function($location, authService){
        
        var vm = this;
        
        vm.company = null;
        vm.email = null;
        vm.username = null;
        vm.password = null;
        vm.erroMessage = null;
        
        vm.signup = function() {
            
            if(authService.user.isAuthenticated) {
                $location.path('/dashboard');
            } else {
                var data = {"company" : vm.company, "email" : vm.email, "username" : vm.username, "password" : vm.password };

                authService.signup(data).then(function(result) {
                    if(result.data.type === "db") {
                        console.log(result.data.message);
                        vm.errorMessage = result.data.message;
                    } else if (result.data.type === "login") {
                        $location.path('/login');
                    } else {
                        $location.path('/dashboard');
                    }
                });
            }
        };
    };
    
    SignupController.$inject = injectParams;
    
    app.register.controller('SignupController', SignupController);
});