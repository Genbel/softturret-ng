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
        'services/webRTCSocketService',
        'services/widgetsRestfulService',
        'lib/webrtc-adapter/adapter',
        'directives/wcAngularOverlay'
    ],
    function () {
        angular.bootstrap(document, ['softturret']);
    });