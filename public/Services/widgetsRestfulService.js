'use strict';

define(['app'], function(app){

    var injectParams = ['$rootScope', '$http', '$q'];

    var widgetsRestfulFactory = function($rootScope, $http, $q) {

        var serviceBase = '/api/dataservice/widget',

        factory = {
            // Actual user widget configuration which it will display
            config: null,
            // All the users that are connected in the system with their socketId
            softUsers: null,
            // All users hashMap
            userHashMap: null,
            // Actual user of the softturret
            user: null
        };

        factory.setUpWidgetsData = function(data){
            this.userHashMap = configureWidgetsHashMap(data.widgets);
            this.user = data.user;
            this.config = data.widgets;
        };

        factory.createWidget = function(data){
            var defer = $q.defer();
            $http.post(serviceBase + '/create', data)

                .then(function(res) {

                    var msg = res;
                    defer.resolve(msg);

                },function(error){
                    defer.reject(error);
                }

            );
            return defer.promise;
        };

        // Set an online attribute to config data structure to know who is connected to the system
        // @square: Socket connected users info
        factory.addConnectStateToWidgets = function(square){

            if(square === null){
                square = this.softUsers;
            } else {
                this.softUsers = square;
            }
            console.log(square);

            _.each(this.config, function(widgets, type){
                _.each(widgets, function(widget, widgetId){
                    _.each(widget.buttons, function(button, index){
                        var userId = button.userId;
                        var online = null;
                        if(square[userId]){
                            online = 'connected';
                        }
                        button.username === null? factory.config[type][widgetId].buttons[index].username = "CH " + button.position: void 0;
                        factory.config[type][widgetId].buttons[index].online = online;
                    })
                });
            });
            console.log(this.config);
        };

        // Update all system data structures
        // @user: The user who has an action
        // @state: What kind of action we have to apply to the user
        factory.updateWidgetConfiguration = function(user, state){

            var online = null;

            if(state === "user-connected"){
                this.softUsers[user.userId] = { "socketId" : user.socketId };
                online = 'connected';
            } else {
                delete this.softUsers[user.userId];
            }
            var userButtons = this.userHashMap.get(user.userId);
            _.each(userButtons, function(button){
                factory.config[button.type][button.widgetIndex].buttons[button.buttonIndex].online = online;
                //$rootScope.$broadcast(button.widgetId);
            });
        };

        return factory;
    };

    // Create a widgets hashMap to faster access to the data
    // @config: widgets configuration from the database
    var configureWidgetsHashMap = function (config){
        // Create the hashMap of users which are in the widgets
        var userWidgetsHashMap = new HashMap();
        // Loop through widgets types, no action in that loop
        _.each(config, function(widgetTypes, type){
            // Loop through widgets
            _.each(widgetTypes, function(widget, widgetIndex){
                // Loop through buttons to get linked user
                _.each(widget.buttons, function(button, index){
                    // The button has user
                    if(button.userId !== null) {
                        var node = { "widgetId": widget._id, "type" : type, "widgetIndex": widgetIndex, "buttonIndex": index};
                        if (!userWidgetsHashMap.has(button.userId)) {
                            var widgetsArray = [node];
                        } else {
                            var widgetsArray = userWidgetsHashMap.get(button.userId);
                            widgetsArray.push(node);
                        }
                        userWidgetsHashMap.set(button.userId, widgetsArray);
                    }
                })
            });
        });
        return userWidgetsHashMap;
    }

    widgetsRestfulFactory.$inject = injectParams;

    app.factory('widgetsRestfulFactory', widgetsRestfulFactory);
});