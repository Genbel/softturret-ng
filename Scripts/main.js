require.config({
    baseUrl: 'public',
    urlArgs: 'v=1.0'
});

require(
    [
        'application'
    ],
    function () {
        angular.bootstrap(document, ['softturret']);
    });
