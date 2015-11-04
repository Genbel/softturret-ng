'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', 'authService', 'webRTCSocketService'];

    var NavbarController = function ($scope, $location, authService, webRTCSocketService) {
        
        var vm = this;
        
        var socket = webRTCSocketService.socket;
        
        vm.appTitle = 'Soffturret';
        
        vm.loginOrOut = function () {
            setLoginLogoutText();
            var isAuthenticated = authService.user.isAuthenticated;
            // logout action
            if (isAuthenticated) { 
                authService.logout().then(function () {
                    $location.path('/');
                    resetTheSocket();
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
        
        $scope.$on('setAppLocation', function(event, args) {
            console.log(args);
            vm.appTitle = args;
        });
        
        function resetTheSocket() {
            socket.emit('logout');
            // Set up the initial values
            webRTCSocketService.username = null;
            webRTCSocketService.initiator = false;
            webRTCSocketService.remotePeerSId = null;
            webRTCSocketService.initiatorUsername = null;
            webRTCSocketService.uuid = null;
            socket.removeListener();
        }

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