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
                console.log("success");
                console.log(data);
            }, function (error) {
                console.log("error");
                console.log(error.data || error.statusText);
            });
        };

        ac.register = function () {
            if (ac.state !== "register") {
                ac.state = "register";
                return;
            }

            UserService.register({
                email: ac.temp.email,
                password: ac.temp.password,
                password2: ac.temp.password2,
            }).then(function (data) {
                console.log("success");
                console.log(data);
            }, function (error) {
                console.log("error");
                console.log(error.data || error.statusText);
            });
        };
    },
]);
