controllers.controller("HeaderController", [
    "$rootScope", "$scope", "$window", "$log",
    function ($rootScope, $scope, $window, $log) {
        var vm = this;
        if (D.debug) $log.info("HeaderController reporting in.");

        vm.scrolledClass = false;
        vm.loggedIn = false;

        function getScrollTop() {
            return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        }

        angular.element($window).on("scroll", function () {
            vm.scrolledClass = getScrollTop() > 10;
            $scope.$apply();
        });

        $rootScope.$on("user.logged", function (loggedIn) {
            vm.loggedIn = loggedIn;
        });
    },
]);
