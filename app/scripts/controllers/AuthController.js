controllers.controller("AuthController", [
    "$scope", "$log", "UserService",
    function ($scope, $log, UserService) {
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
            }).then(function (data) {
                $log.log("logged in");
                $log.log(data);
                // angular ui router
            }, function (error) {
                $log.error("error");
                $log.log(error);
            });
        };
    },
]);
