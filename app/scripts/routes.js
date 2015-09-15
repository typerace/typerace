typerace.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

    // Default route
    $urlRouterProvider.otherwise('/');

    // Enable no-hash routing
    $locationProvider.html5Mode(true);

    // Define states
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'template/home.html'
        })
        .state('auth', {
            url: '/auth',
            templateUrl: 'template/auth.html',
            controller: 'AuthController'
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'template/dashboard.html',
            controller: 'DashboardController'
        })
        .state('lobby', {
            url: '/lobby',
            templateUrl: 'template/lobby.html',
            controller: 'LobbyController'
        })
        .state('race', {
            url: '/race/:id',
            templateUrl: 'template/race.html',
            controller: 'RaceController'
        })
        .state('summary', {
            url: '/summary/:id',
            templateUrl: 'template/summary.html',
            controller: 'SummaryController'
        })
        .state('scores', {
            url: '/hall-of-fame',
            templateUrl: 'template/scores.html',
            controller: 'ScoresController'
        })
        .state('help', {
            url: '/help',
            templateUrl: 'template/help.html',
            controller: 'HelpController'
        })
        .state('contact', {
            url: '/contact',
            templateUrl: 'template/contact.html',
            controller: 'ContactController'
        })
        .state('pricing', {
            url: '/pricing',
            templateUrl: 'template/pricing.html',
            controller: 'PricingController'
        });

}]);