controllers.controller("HomeController", [
    "$rootScope", "$scope", "$window", "$log",
    function ($rootScope, $scope, $window, $log) {
        var vm = this;
        if (D.debug) $log.info("HomeController reporting in.");

        vm.text = "Welcome to typerace.io!";
    },
]);
