'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', 'authService', 'webRTCSocketService'];

    var NavbarController = function ($scope, $location, authService, webRTCSocketService) {
        
        var vm = this;
        
        var socket = webRTCSocketService.socket;
        
        vm.appTitle = 'Soffturret';
        vm.show = true; 
        
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
        
        $scope.$on('trading', function(event, args) {
            vm.show = args;
        });
        
        function resetTheSocket() {
            socket.emit('logout');
            // Set up the initial values
            webRTCSocketService.username = null;
            webRTCSocketService.initiator = false;
            webRTCSocketService.joinerUsername = null;
            webRTCSocketService.remotePeerSId = null;
            webRTCSocketService.remotePeerUsername = null;
            webRTCSocketService.uuid = null;
        }

        function setLoginLogoutText() {
            vm.loginLogoutText = (authService.user.isAuthenticated) ? 'Logout' : 'Login';
        }

        setLoginLogoutText();
        
        $scope.$on('$destroy', function(){
            socket.disconnect();
        });

    };

    NavbarController.$inject = injectParams;


    //Loaded normally since the script is loaded upfront 
    //Dynamically loaded controller use app.register.controller
    // app = angular.module('softturret, ...)
    app.controller('NavbarController', NavbarController);

});