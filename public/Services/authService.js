'use strict';

define(['app'], function(app){

    var injectParams = ['$http', '$rootScope', '$q','widgetsRestfulFactory'];

    var authFactory = function ($http, $rootScope, $q, widgetsRestfulFactory) {

        var serviceBase = '/api/dataservice/',
        factory = {
            user: {
                isAuthenticated: false,
                name: null
            }
        };

        factory.login = function (authToken) {
            // We set a helper to run asynchronous functions.
            // 'then' function already is a helper asynchronous function but in our case we want to send back,
            // the successful or error message to the controller. Thats why we create defer function here.
            // Like this the controller will get as success(resolve) or error(reject) message. Finally we have to send back
            // the object(promise)
            // The function 'then', waits til the answer of the server and after it manages if the respond
            // is success(then) or error(function).
            var def = $q.defer();
            // Send HTTP request to the server to authenticate the user
            $http.post(serviceBase + 'login', authToken)
                // The respond was with 200 status
                // The respond is successful
                .then(function(res) {
                    var loggedIn = res.data.authenticated,
                        data = null;
                    changeAuth(loggedIn);
                    // The credintials are not correct one
                    if(res.data.message){
                        data = {"authenticated" : loggedIn, "message" : res.data.message};
                    // The user is authenticate so redirect to dashboard
                    // and set the userlogged
                    } else {
                        console.log(res);
                        widgetsRestfulFactory.config = res.data.widgets;
                        widgetsRestfulFactory.softUsers = res.data.users;
                        data = { "authenticated" : loggedIn };
                    }
                    def.resolve(data);
                }// The respond has an error(reaching database...). Display the error.
                ,function(res){
                    def.reject(res);
                })
            ;
            return def.promise;
        };
        
        factory.logout = function () {
            return $http.post(serviceBase + 'logout').then(
                function (results) {
                    var loggedIn = false;
                    changeAuth(loggedIn);
                    return loggedIn;
                }, function(err){
                    return err;
                });
        };
        
        factory.signup = function(data) {
            
            return $http.post(serviceBase + 'signup', data).then(function(result) {
                if(result.data.type === "login-ok") {
                    changeAuth(true);
                }
                return result;
            });
        };

        function changeAuth(loggedIn) {
            factory.user.isAuthenticated = loggedIn;
        }


        factory.redirectToLogin = function () {
            $rootScope.$broadcast('redirectToLogin', null);
        };

        function changeAuth(loggedIn) {
            factory.user.isAuthenticated = loggedIn;
            $rootScope.$broadcast('loginStatusChanged', loggedIn);
        }

        return factory;
    };

    //By adding an $inject property onto a function the injection parameters can be specified
    // If a function has an $inject property and its value is an array of strings, then the strings represent names of services to be injected into the function.
    authFactory.$inject = injectParams;

    app.factory('authService', authFactory);
});