controllers.controller("AuthController", [
    "$rootScope", "$scope", "$log", "UserService", "$state",
    function ($rootScope, $scope, $log, UserService, $state) {
        var ac = this;
        if (D.debug) $log.info("AuthController reporting in.");

        ac.user = D.user;
        ac.processing = false;
        ac.form = {};

        ac.state = "login";
        ac.temp = {
            email: "",
            password: "",
            password2: "",
        };

        ac.login = function () {
            UserService.login({
                email: ac.temp.email,
                password: ac.temp.password,
            }).then(function (user) {
                $rootScope.$emit("user.action", user);
                $state.go("home");
            }, function (error) {
                $log.error("error");
                $log.log(error);
            });
        };
    },
]);
