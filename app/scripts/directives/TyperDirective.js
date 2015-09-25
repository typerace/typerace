directives.directive("typer", [
    function () {
        return {
            restrict: "E",
            replace: true,
            templateUrl: "/directive/typer.html",
            controller: "TyperController",
            scope: {
                mode: "@",
            },
        };
    },
]);
