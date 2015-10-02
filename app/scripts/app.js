controllers = angular.module("controllers", []);
directives = angular.module("directives", []);
factories = angular.module("factories", []);
services = angular.module("services", []);
filters = angular.module("filters", []);
typerace = angular.module("typerace", [
    // "pascalprecht.translate",
    "angularMoment",
    // "ngFileUpload",
    "ngResource",
    "ngSanitize",
    "ui.router",
    "filters",
    "services",
    "factories",
    "directives",
    "controllers",
]).run(function ($templateCache, $http, $timeout, $rootScope, amMoment) {
    $rootScope.$on("$stateChangeSuccess", function () {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    });

    amMoment.changeLocale(navigator.language);

    // $translate.use(C.locale || navigator.language.split("-")[0]);

    /* preload templates
     $timeout(function() {
     $http.get("front/page/home", {cache:$templateCache});
     }, 200);
     */

    // $(".modal-trigger").leanModal();

    $rootScope.$on("user.action", function (user) {
        $rootScope.user = user;
        $rootScope.$emit("user.logged", !!user);
    });

    $http.get(D.api.url + "/users/check").then(function (user) {
        $rootScope.$emit("user.action", user);
    });
});
