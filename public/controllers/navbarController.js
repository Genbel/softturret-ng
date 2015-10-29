'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', 'authService'];

    var NavbarController = function ($scope, $location, authService) {
        
        var vm = this;
        
        vm.appTitle = 'Soffturret';
        
        vm.loginOrOut = function () {
            setLoginLogoutText();
            var isAuthenticated = authService.user.isAuthenticated;
            // logout action
            if (isAuthenticated) { 
                authService.logout().then(function () {
                    $location.path('/');
                    return;
                });
            }else {
                // login action
                redirectToLogin();
            }
        };

        function redirectToLogin() {
            var path = '/login';
            $location.replace();
            $location.path(path);
        }

        $scope.$on('loginStatusChanged', function (loggedIn) {
            setLoginLogoutText();
        });

        $scope.$on('redirectToLogin', function () {
            redirectToLogin();
        });

        function setLoginLogoutText() {
            vm.loginLogoutText = (authService.user.isAuthenticated) ? 'Logout' : 'Login';
        }

        setLoginLogoutText();

    };

    NavbarController.$inject = injectParams;


    //Loaded normally since the script is loaded upfront 
    //Dynamically loaded controller use app.register.controller
    // app = angular.module('softturret, ...)
    app.controller('NavbarController', NavbarController);

});