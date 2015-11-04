'use strict';

define(['app'], function(app) {
    
    var injectParams = ['$uibModal'];
    
    var modalService = function($uibModal) {
        
        var modalDefaults = {
            backdrop: 'static',
            keyboard: false,
            modalFade: true,
            templateUrl: '/angular-js/views/dashboard/partials/callNegotiationModal.html'
        };

        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Incoming call',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            console.log('modal');
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
                tempModalDefaults.controller = function ($scope, $uibModalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.accept = function (result) {
                        $uibModalInstance.close('ok');
                    };
                    $scope.modalOptions.reject = function (result) {
                        $uibModalInstance.close('cancel');
                    };
                };

                tempModalDefaults.controller.$inject = ['$scope', '$uibModalInstance'];
            }

            return $uibModal.open(tempModalDefaults).result;
        };
        
    };
    
    modalService.$inject = injectParams;
    
    app.service('modalService', modalService);
});