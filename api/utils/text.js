module.exports = {
    measureDifficulty: function (text) {
        var sentences = text.split(".");
        var words = text.replace(/[^a-z ]/ig, "").split(" ");

        var sentencesLength = sentences.length; // * 1 point

        // Word per sentence
        var wpsArr = [];
        var wpsAvg = 0; // * 10 points
        var wpsTop = 0; // * 1 point

        // Word length
        var wlArr = [];
        var wlAvg = 0; // * 10 points
        var wlTop = 0; // * 1 point

        // Special characters
        var specials = (text.match(/[^a-z\., ]/ig) || []).length; // * 2 points

        sentences.map(function (sentence) {
            var sentenceWords = sentence.trim().split(" ");

            if (sentenceWords.length > wpsTop) wpsTop = sentenceWords.length;
            wpsArr.push(sentenceWords.length);
        });

        words.map(function (word) {
            if (word.length > wlTop) wlTop = word.length;
            wlArr.push(word.length);
        });

        wpsAvg = wpsArr.reduce(function (sum, len) {
            return sum + len;
        }, 0) / wpsArr.length;

        wlAvg = wlArr.reduce(function (sum, len) {
            return sum + len;
        }, 0) / wlArr.length;

        return Math.round(
            sentencesLength + wpsTop + wlTop +
            (wpsAvg * 10) + (wlAvg * 10) + (specials * 2)
        );
    },

    formatText: function (text) {
        return text
            .replace(/\s\s+/g, " ")
            .replace(/\s*(\.|,|:|;)\s*/g, "$1 ")
            .replace(/\s*(')\s*/g, "$1")
            .trim();
    },

    formatSaved: function (text) {
        return text
            .replace(/\s*(\.|,|:|;)\s*/g, "$1")
            .trim();
    },
};