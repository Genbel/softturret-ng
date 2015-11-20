'use strict';

define(['app'], function(app){

    var injectParams = ['$http', '$q'];

    var restfulFactory = function($http, $q) {

        var serviceBase = '/api/dataservice/widget',
            factory = {};

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

        return factory;
    };

    restfulFactory.$inject = injectParams;

    app.factory('restfulFactory', restfulFactory);
});