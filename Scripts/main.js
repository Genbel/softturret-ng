require.config({
    baseUrl: '/angular-js',
    waitSeconds: 200
});

require(
    [   
        'app',
        'services/routeResolver',
        'controllers/navbarController',
        'services/modalService',
        'services/authService',
        'services/softturretSocketService',
        'services/widgetsRestfulService',
        'lib/webrtc-adapter/adapter',
        'directives/wcAngularOverlay',
        'views/dashboard/directives/small/small.core'
    ],
    function () {
        angular.bootstrap(document, ['softturret']);
    });