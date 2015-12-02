'use strict';

define(['app'], function(app){

    var injectParams = ['$http', '$q'];

    var widgetsRestfulFactory = function($http, $q) {

        var serviceBase = '/api/dataservice/widget',
            factory = {
                // Actual user widget configuration
                config: null,
                // All the users that are in the system with their actual state. Connected: 1 or 0
                softUsers: null,
                // All users hashMap
                widgetsHashMap: null,
                // Actual user of the softturret
                user: null
            };

        factory.setUpWidgetsData = function(data){
            configureWidgetsHashMap(data.widgets);
            //configureUsersHashMap(data.softUsers);
            this.softUsers = data.softUsers;
            this.user = data.user;
            this.config = data.widgets;
            console.log(this.config);
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
            console.log(info);
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

    // Create a widgets hashMap to faster access to the data
    // @config: widgets configuration from the database
    var configureWidgetsHashMap = function (config){
        // Create the widgets hashMap
        var widgetGroupHashMap = new HashMap();
        // For each type of widget create another hashMap
        _.each(config, function(widgetGroup, type){
            var widgetHashMap = new HashMap();
            _.each(widgetGroup, function(widget){
                var buttonHashMap = new HashMap();
                _.each(widget.buttons, function(button){
                    buttonHashMap.set(button._id, button);
                });
                widgetHashMap.set(widget._id, buttonHashMap);
            });
            widgetGroupHashMap.set(type, widgetHashMap);
        });
        factory.widgetsHashMap = widgetGroupHashMap;
        //return widgetGroupHashMap;
    }

    var configureUsersHashMap = function(users){



    };

    app.factory('widgetsRestfulFactory', widgetsRestfulFactory);
});