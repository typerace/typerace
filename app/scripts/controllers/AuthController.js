controllers.controller("AuthController", [
    "$log",
    function($log) {
        var vm = this;
        if (D.debug) $log.info("AuthController reporting in.");

        vm.user = D.user;
        vm.processing = false;
        vm.form = {};
    },
]);
