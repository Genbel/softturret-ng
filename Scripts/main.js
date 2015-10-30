require.config({
    baseUrl: '/angular-js'
});

require(
    [   
        'app',
        'services/routeResolver',
        'controllers/navbarController',
        'services/authService',
        'services/webRTCSocketService',
        'directives/wcAngularOverlay'
    ],
    function () {
        angular.bootstrap(document, ['softturret']);
    });