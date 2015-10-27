require.config({
    baseUrl: '/angular-js'
});

require(
    [
        'app',
        'controllers/loginController',
        'controllers/navbarController',
        'services/authService'
    ],
    function () {
        angular.bootstrap(document, ['softturret']);
    });
