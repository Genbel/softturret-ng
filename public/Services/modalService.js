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
            closeButtonText: 'Cancel',
            actionButtonText: 'Add',
            headerText: 'Incoming call',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in this service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in this service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $uibModalInstance, widgetsRestfulFactory) {

                    $scope.widgetName = null;

                    // Set up the button actions
                    $scope.modalOptions = tempModalOptions;

                    $scope.modalOptions.accept = function () {
                        widgetsRestfulFactory.createWidget( { widgetSize: 8, name: $scope.widgetName} )
                            .then(function(msg){
                                widgetsRestfulFactory.config = msg.data.widgets;
                                widgetsRestfulFactory.addConnectStateToWidgets(null);
                                $uibModalInstance.close('ok');
                            });
                    };

                    $scope.modalOptions.reject = function () {
                        $uibModalInstance.close('cancel');
                    };
                };

                tempModalDefaults.controller.$inject = ['$scope', '$uibModalInstance', 'widgetsRestfulFactory'];
            }

            return $uibModal.open(tempModalDefaults).result;
        };

    };

    modalService.$inject = injectParams;
    
    app.service('modalService', modalService);
});