services.service("UserService", [
    "$http",
    function ($http) {
        this.login = function (input) {
            return $http.post(D.api.url + "/users/magic", input);
        };

        this.logout = function () {
            return $http.post(D.api.url + "/users/logout", {});
        };

        this.check = function () {
            return $http.post(D.api.url + "/users/check", {});
        };
    },
]);
