'use strict';

define(['app'], function(app){

    var injectParams = ['$http', '$q'];

    var widgetsRestfulFactory = function($http, $q) {

        var serviceBase = '/api/dataservice/widget',
            factory = {
                config: null,
                softUsers: null
            };

        factory.getUserWidgets = function(){

        };

        factory.createWidget = function(type){
            var defer = $q.defer();
            $http.post(serviceBase + '/create', type)

                .then(function(res) {

                    var msg = res;
                    defer.resolve(msg);

                },function(error){
                    defer.reject(error);
                }

            );
            return defer.promise;
        };

        factory.attachUserToChannel = function(widgetId, buttonId, userId, username) {
            var defer = $q.defer();
            var info = {"widgetId" : widgetId, "buttonId" : buttonId, "userId" : userId, "username" : username};
            $http.post(serviceBase + '/add/user', info)
                .then(function(){
                    defer.resolve();
                },function(error) {
                    defer.reject(error);
                });
            return defer.promise;
        };

        return factory;
    };

    widgetsRestfulFactory.$inject = injectParams;

    app.factory('widgetsRestfulFactory', widgetsRestfulFactory);
});