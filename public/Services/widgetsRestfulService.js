'use strict';

define(['app'], function(app){

    var injectParams = ['$rootScope', '$http', '$q'];

    var widgetsRestfulFactory = function($rootScope, $http, $q) {

        var serviceBase = '/api/dataservice/widget',

        factory = {
            // Actual user widget configuration which it will display
            softConfig: null,
            // All the users that are connected in the system with their socketId
            softUsers: null,
            // All users hashMap
            userHashMap: null,
            // Actual user of the softturret
            user: null
        };

        // We call to that function when the login is successful and before redirect to dashboard
        factory.setUpWidgetsData = function(data){

            this.userHashMap = configureWidgetsHashMap(data.widgets);
            this.user = data.user;
            this.softConfig = data.widgets;
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

        // Set an online attribute to softConfig data structure to know who is connected to the system
        // @square: Socket connected users info
        factory.addConnectStateToWidgets = function(square){
            // When we add a new widget in our panel of widgets. There is not any connection with the socket,
            // that why is null the square
            if(square === null){
                square = this.softUsers;
            // When the socket sends the users square. Normally is when one user connect or disconnect
            } else {
                this.softUsers = square;
            }
            // Loop all the widgets to add connected state
            _.each(this.softConfig, function(widgets, type){
                _.each(widgets, function(widget, widgetId){
                    _.each(widget.buttons, function(button, index){
                        var userId = button.remoteUserId;
                        var online = null;
                        if(square[userId]){
                            online = 'connected';
                        }
                        button.tag === null? factory.softConfig[type][widgetId].buttons[index].tag = "BTN " + button.position : void 0;
                        factory.softConfig[type][widgetId].buttons[index].online = online;
                    })
                });
            });
        };

        // Update all system data structures when new user connected
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
                factory.softConfig[button.widgetType][button.widgetIndex].buttons[button.buttonIndex].online = online;
                //$rootScope.$broadcast(button.widgetId);
            });
        };

        return factory;
    };

    // Create a widgets hashMap to faster access to the data
    // @softConfig: widgets configuration from the database
    var configureWidgetsHashMap = function (softConfig){
        // Create the hashMap of users which are in the widgets
        var userWidgetsHashMap = new HashMap();
        // Loop through widgets types, no action in that loop
        _.each(softConfig, function(widgetTypes, type){
            // Loop through widgets
            _.each(widgetTypes, function(widget, widgetIndex){
                // Loop through buttons to get linked user
                _.each(widget.buttons, function(button, index){
                    // The button has licence and it has to be softturret channel
                    if(button.licenceId !== null ) {
                        var node = { "widgetId": widget._id, "widgetType" : type, "widgetIndex": widgetIndex, "buttonIndex": index, "remoteUserType": button.remoteUserType, "dirNo": button.dirNo};
                        // Get the key of the array depending of the channel type: SOFT, CAS, SIP,...
                        // Default channel type is SIP, CAS, ...
                        var typeKey = 'others';
                        // Channel type is softturret
                        if(button.remoteUserType == 5){
                            typeKey = button.remoteUserId;
                        }
                        // Add info in the user hashMap
                        if (!userWidgetsHashMap.has(typeKey)) {
                            var licencesArray = {};
                            licencesArray[button.licenceId] = node;
                        } else {
                            var licencesArray = userWidgetsHashMap.get(typeKey);
                            licencesArray[button.licenceId] = node;
                        }
                        userWidgetsHashMap.set(typeKey, licencesArray);
                    }
                })
            });
        });
        console.log(userWidgetsHashMap);
        return userWidgetsHashMap;
    }

    widgetsRestfulFactory.$inject = injectParams;

    app.factory('widgetsRestfulFactory', widgetsRestfulFactory);
});