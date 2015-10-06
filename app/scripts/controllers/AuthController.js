controllers.controller("AuthController", [
    "$rootScope", "$scope", "$log", "UserService", "$state",
    function ($rootScope, $scope, $log, UserService, $state) {
        var vm = this;
        if (D.debug) $log.info("AuthController reporting in.");

        vm.user = D.user;
        vm.processing = false;
        vm.form = {};

        vm.state = "login";
        vm.temp = {
            email: "",
            password: "",
            password2: "",
        };

        vm.login = function () {
            UserService.login({
                email: vm.temp.email,
                password: vm.temp.password,
            }).then(function (user) {
                $rootScope.$emit("user.vmtion", user);
                $state.go("home");
            }, function (error) {
                $log.error("error");
                $log.log(error);
            });
        };
    },
]);
