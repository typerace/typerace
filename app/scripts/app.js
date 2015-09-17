var typerace = angular.module('typerace', [
    //'pascalprecht.translate',
    'angularMoment',
    //'ngFileUpload',
    'ngResource',
    'ngSanitize',
    //'ngAnimate',
    'ui.router',
    //'toastr',
    'filters',
    'services',
    'factories',
    'directives',
    'controllers'
]).run(function($templateCache, $http, $timeout, $rootScope, amMoment) {
    $rootScope.$on('$stateChangeSuccess', function() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    });

    amMoment.changeLocale(navigator.language);

    //$translate.use(C.locale || navigator.language.split('-')[0]);

    /* preload templates *
    $timeout(function() {
         $http.get('front/page/home', {cache:$templateCache});
    }, 200);
    /* */

    $('.modal-trigger').leanModal();
});

// Declare modules
var filters = angular.module('filters', []);
var services = angular.module('services', []);
var factories = angular.module('factories', []);
var directives = angular.module('directives', []);
var controllers = angular.module('controllers', []);