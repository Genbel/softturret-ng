var injectParams = ['$http', '$rootScope', '$q'];

var authFactory = function ($http, $rootScope, $q) {
    
    var serviceBase = '/api/dataservice/',
    factory = {
        user: {
            isAuthenticated: false,
            //roles: null
        }
    };

    factory.login = function (authToken, success, error) {
        // We set a helper to run asynchronous functions.
        // 'then' function already is a helper asynchronous function but in our case we want to send back,
        // the successful or error message to the controller. Thats why we create defer function here.
        // Like this the controller will get as success(resolve) or error(reject) message. Finally we have to send back
        // the object(promise)
        // The function 'then', waits til the answer of the server and after it manages if the respond
        // is success(then) or error(function).
        var def = $q.defer();
        // Send HTTP request to the server to authenticate the user
        $http.post('/login', authToken)
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
    
    function changeAuth(loggedIn) {
        factory.user.isAuthenticated = loggedIn;
    }
         
         
         
         
         /*success(function(res) {
                console.log(res);
                success(res);
                /*var loggedIn = results.data.status;
                changeAuth(loggedIn);
                
                return loggedIn;
            }).error(function(error){
                console.log(error);
            });*/
         
    

    /*factory.logout = function () {
        return $http.post(serviceBase + 'logout').then(
            function (results) {
                var loggedIn = !results.data.status;
                changeAuth(loggedIn);
                return loggedIn;
            });
    };

    */factory.redirectToLogin = function () {
        $rootScope.$broadcast('redirectToLogin', null);
    };

    function changeAuth(loggedIn) {
        factory.user.isAuthenticated = loggedIn;
        //$rootScope.$broadcast('loginStatusChanged', loggedIn);
    }

    return factory;
};

//By adding an $inject property onto a function the injection parameters can be specified
// If a function has an $inject property and its value is an array of strings, then the strings represent names of services to be injected into the function.
authFactory.$inject = injectParams;

angular.module('softturret').factory('authService', authFactory);