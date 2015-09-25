directives.directive("typer", [
    function () {
        return {
            restrict: "E",
            replace: true,
            templateUrl: "/directive/typer.html",
            controller: "TyperController",
            controllerAs: "tr",
            scope: {
                mode: "@",
            },
        };
    },
]);

controllers.controller("TyperController", [
    "$log",
    function ($log) {
        var tr = this;
        if (D.debug) $log.info("TyperController reporting in.");

        tr.words = [];
        tr.wordIndex = 0;
        tr.text = "I'm writing a basic sentence, yay!";

        function parseText(text) {
            tr.text = text;
            tr.words = text.split(" ").map(function (word) {
                return {
                    word: word,
                    stage: 0,
                };
            });
        }

        tr.getText = function getText() {
            return tr.words.map(function (word, index) {
                return word.stage || index === tr.wordIndex ? "<span>" + word.word + "</span>" : word.word;
            }).join(" ");
        };

        parseText(tr.text);
    },
]);
