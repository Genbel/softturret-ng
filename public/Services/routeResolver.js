'use strict';

// This a a provider object.
// This is to manage all the routes of the app. It capsulates in that provider and like this we don't need
// to add in the index.html as a script
define([], function () {

    var routeResolver = function () {

        // The provider is an object: then it should have a $get method. 
        // The $get method will be invoked using $injector.invoke() when an instance needs to be created.
        this.$get = function () {
            return this;
        };

        this.routeConfig = function () {
            var viewsDirectory = '/angular-js/views/',
                controllersDirectory = '/angular-js/controllers/',

            setBaseDirectories = function (viewsDir, controllersDir) {
                viewsDirectory = viewsDir;
                controllersDirectory = controllersDir;
            },

            getViewsDirectory = function () {
                return viewsDirectory;
            },

            getControllersDirectory = function () {
                return controllersDirectory;
            };

            return {
                setBaseDirectories: setBaseDirectories,
                getControllersDirectory: getControllersDirectory,
                getViewsDirectory: getViewsDirectory
            };
        }();

        this.route = function (routeConfig) {

            var resolve = function (baseName, path, controllerAs, secure) {
                if (!path) path = '';

                var routeDef = {};
                var baseFileName = baseName.charAt(0).toLowerCase() + baseName.substr(1);
                // The view which will be displayed
                routeDef.templateUrl = routeConfig.getViewsDirectory() + path + baseFileName + '.html';
                // The controller of the view
                routeDef.controller = baseName + 'Controller';
                // Gets rid of the $scope and we can use that variable in the controller and after pass to the view. 
                // $scope we will use only in watch, apply, digest, on, emit, broadcast cases
                // In our case the controller will call 'vm'(view model)
                if (controllerAs) routeDef.controllerAs = controllerAs;
                // To control the login
                routeDef.secure = (secure) ? secure : false;
                // Load our controller from the path that we give. We use asynchronous funciton($q.defer) to charge the controller.
                routeDef.resolve = {
                    load: ['$q', '$rootScope', function ($q, $rootScope) {
                        var dependencies = [routeConfig.getControllersDirectory() + path + baseFileName + 'Controller.js'];
                        return resolveDependencies($q, $rootScope, dependencies);
                    }]
                };

                return routeDef;
            },

            resolveDependencies = function ($q, $rootScope, dependencies) {
                var defer = $q.defer();
                // Charges from requireJS the controller that we need
                require(dependencies, function () {
                    defer.resolve();
                    // Update our module calling to $apply function to have effects in our modele. We
                    // charge a library with requireJS so angularJS doesn't realize about that load.
                    $rootScope.$apply();
                });

                return defer.promise;
            };
            // When we call in the app.js, it returns resolve function. After in routeProvider, it calls to resolve function
            // It call like route.resolve because it returns a pair object. The resolve object is the same as the routeDef.
            return {
                resolve: resolve
            }
        }(this.routeConfig);

    };

    var servicesApp = angular.module('routeResolverServices', []);

    //Must be a provider since it will be injected into module.config()    
    servicesApp.provider('routeResolver', routeResolver);
});
