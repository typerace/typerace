factories.factory("$simple", [
    "$http",
    function $simple($http) {
        function applyOn(fn, _arguments) {
            var args = [].slice.call(_arguments);

            return $http[fn].apply($http[fn], args).success(function () {
                return true;
            }).error(function () {
                return false;
            });
        }

        return {
            get: function () {
                return applyOn("get", arguments);
            },
            post: function () {
                return applyOn("post", arguments);
            },
        };
    },
]);
