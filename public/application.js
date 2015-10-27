//var appName = 'softturret';

var app = angular.module(appName,['ngRoute', 'ui.bootstrap']);

/*angular.element(document).ready(function() {
    angular.bootstrap(document, [appName] );
});*/


app.config(function ($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: '/angular-js/views/login.html',
            controller: 'LoginController'
        })
        .when('/dashboard', {
            templateUrl: '/angular-js/views/dashboard/dashboard.html'
        })
        .when('/signup', {
            templateUrl: '/angular-js/views/signup.html'
        })
        .otherwise({ redirectTo: '/login' });
});

app.run(['$rootScope', '$location', 'authService',
        
         function ($rootScope, $location, authService) {
            
            //Client-side security. Server-side framework MUST add it's 
            //own security as well since client-based security is easily hacked
            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                if (!authService.user.isAuthenticated) {
                    authService.redirectToLogin();
                }
            });
         }
]);