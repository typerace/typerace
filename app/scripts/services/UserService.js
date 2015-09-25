services.service("UserService", [
    "$simple",
    function ($simple) {
        this.login = function (input) {
            return $simple.post(D.api.url + "/users/login", input);
        };

        this.logout = function () {
            return $simple.post(D.api.url + "/users/logout", {});
        };

        this.register = function (input) {
            return $simple.post(D.api.url + "/users/register", input);
        };
    },
]);
