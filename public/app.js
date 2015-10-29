'use strict';

define(['services/routeResolver'], function(){
    
    var appName = 'softturret';

    var app = angular.module(appName,['ngRoute', 'ui.bootstrap', 'routeResolverServices', 'wc.Directives']);

    app.config(['$routeProvider', 'routeResolverProvider', '$controllerProvider',
                '$compileProvider', '$filterProvider', '$provide', '$httpProvider',
               
        function ($routeProvider, routeResolverProvider, $controllerProvider,
                  $compileProvider, $filterProvider, $provide, $httpProvider){
        
            app.register =
                {
                    controller: $controllerProvider.register,
                    directive: $compileProvider.directive,
                    filter: $filterProvider.register,
                    factory: $provide.factory,
                    service: $provide.service
                };

            //Define routes - controllers will be loaded dynamically
            var route = routeResolverProvider.route;
        
            $routeProvider
                //route.resolve() now accepts the convention to use (name of controller & view) as well as the 
                //path where the controller or view lives in the controllers or views folder if it's in a sub folder. 
                //For example, the controllers for customers live in controllers/customers and the views are in views/customers.
                //The controllers for orders live in controllers/orders and the views are in views/orders
                //The second parameter allows for putting related controllers/views into subfolders to better organize large projects
                //Thanks to Ton Yeung for the idea and contribution
                .when('/login', route.resolve('Login', '', 'vm'))
                .when('/dashboard', route.resolve('Dashboard', 'dashboard/', 'vm', true))
                .when('/signup', route.resolve('Signup','','vm'))
                .otherwise({ redirectTo: '/dashboard' });
    }]);

    app.run(['$rootScope', '$location', 'authService',

             function ($rootScope, $location, authService) {

                //Client-side security. Server-side framework MUST add it's 
                //own security as well since client-based security is easily hacked
                $rootScope.$on("$routeChangeStart", function (event, next, current) {
                    if (next && next.$$route && next.$$route.secure) {
                        console.log('secure = true');
                        if(!authService.user.isAuthenticated){
                            $rootScope.$evalAsync(function() {
                                authService.redirectToLogin();
                            });
                        }
                    }
                });
             }
    ]);
    
    return app;
});