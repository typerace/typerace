controllers.controller("HeaderController", [
    "$rootScope", "$scope", "$window", "$log",
    function ($rootScope, $scope, $window, $log) {
        var hc = this;
        if (D.debug) $log.info("HeaderController reporting in.");

        hc.scrolledClass = false;
        hc.loggedIn = false;

        function getScrollTop() {
            return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        }

        angular.element($window).on("scroll", function () {
            hc.scrolledClass = getScrollTop() > 10;
            $scope.$apply();
        });

        $rootScope.$on("user.logged", function (loggedIn) {
            hc.loggedIn = loggedIn;
        });
    },
]);
