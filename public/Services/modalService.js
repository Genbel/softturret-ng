'use strict';

define(['app'], function(app) {
    
    var injectParams = ['$uibModal'];

    var modalService = function($uibModal) {

        var modalDefaults = {
            backdrop: 'static',
            keyboard: false,
            modalFade: true,
            templateUrl: '/angular-js/views/dashboard/partials/addUserModal.html'
        };

        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Incoming call',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions, buttonId, widgetId) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in this service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in this service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $rootScope, $uibModalInstance, widgetsRestfulFactory) {
                    var userId = null;
                    var username = null;
                    // Get the user list for the widgets service
                    $scope.userList = {
                        0: {"_id" : "564da352e801c57c031756d2", "username" : "Keith"},
                        1: {"_id" : "564da36fe801c57c031756d3", "username" : "Linute"},
                        2: {"_id" : "564da38ae801c57c031756d4", "username" : "Aita"},
                        3: {"_id" : "564da39de801c57c031756d5", "username" : "Ama"},
                        4: {"_id" : "564da330e801c57c031756d1", "username" : "Oier"}
                    };
                    // Get the user _id to add user
                    $scope.getUserId = function(){
                        userId = this.user._id;
                        username = this.user.username;
                    };
                    // Set up the button actions
                    $scope.modalOptions = tempModalOptions;

                    $scope.modalOptions.accept = function () {

                        widgetsRestfulFactory.attachUserToChannel(widgetId, buttonId, userId, username).then(function(){
                            var editedConfig = editWidgetConfig(widgetId, buttonId, userId, username, widgetsRestfulFactory.config.small, widgetsRestfulFactory.softUsers);
                            $rootScope.$broadcast('user-config-updated', editedConfig);
                            $uibModalInstance.close('ok');
                        },function(error){
                            console.log(error);
                        });
                    };
                    $scope.modalOptions.reject = function () {
                        $uibModalInstance.close('cancel');
                    };
                };

                tempModalDefaults.controller.$inject = ['$scope', '$rootScope', '$uibModalInstance', 'widgetsRestfulFactory'];
            }

            return $uibModal.open(tempModalDefaults).result;
        };

    };

    modalService.$inject = injectParams;
    
    app.service('modalService', modalService);

    // Instead of bring all the configuration again from the database, we will make changes locally
    var editWidgetConfig = function(widgetId, buttonId, userId, username, smallWidgets, softUsers) {

        for(var i=0; i < smallWidgets.length;i++) {
            if(smallWidgets[i]._id === widgetId){
                for(var j = 0; j < smallWidgets[i].buttons.length; j++) {
                    if(smallWidgets[i].buttons[j]._id == buttonId) {
                        smallWidgets[i].buttons[j].username = username;
                        smallWidgets[i].buttons[j].userId = userId;
                        smallWidgets[i].buttons[j].online = null;
                        // Check if the user is connected
                        if(softUsers[userId]){
                            smallWidgets[i].buttons[j].online = 'connected';
                        }

                    }
                }
            }
        }
        return smallWidgets;
    };
});