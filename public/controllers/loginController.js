'use strict';

var injectParams = ['$scope', '$location', 'authService'];

var LoginController = function($scope, $location, authService) {
    
    $scope.username = null;
    $scope.password = null;
    $scope.errorMessage = null;
    
    $scope.login = function() {
        authService.login({username: $scope.username, password: $scope.password})
            .then(function(status){
            console.log(authService.user);
                if(!status.authenticated){
                    $scope.errorMessage = status.message;
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

angular.module('softturret').controller('LoginController', LoginController);
    