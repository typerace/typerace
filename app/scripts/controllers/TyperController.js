controllers.controller("TyperController", [
    "$log",
    "$scope",
    function ($log, $scope) {
        var vm = $scope;
        if (D.debug) $log.info("TyperController reporting in.");

        vm.words = [];
        vm.wordIndex = 0;
        vm.text = "I'm writing a basic sentence, yay!";

        function parseText(text) {
            vm.text = text;
            vm.words = text.split(" ").map(function (word) {
                return {
                    word: word,
                    stage: 0,
                };
            });
        }

        vm.getText = function getText() {
            return vm.words.map(function (word, index) {
                return word.stage || index === vm.wordIndex ? "<span>" + word.word + "</span>" : word.word;
            }).join(" ");
        };

        parseText(vm.text);
    },
]);
