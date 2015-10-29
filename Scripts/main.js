require.config({
    baseUrl: '/angular-js'
});

require(
    [   
        'app',
        'services/routeResolver',
        //'controllers/loginController',
        'controllers/navbarController',
        'services/authService',
        'directives/wcAngularOverlay'
    ],
    function () {
        angular.bootstrap(document, ['softturret']);
    });
