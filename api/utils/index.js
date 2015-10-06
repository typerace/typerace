module.exports = {
    text: require("./text"),

    generateHash: function (segmentsArg) {
        var hash = [];
        var segments = +segmentsArg || 0;

        while (segments--) hash.push(Math.random().toString(36).substring(2));

        return hash.join("-");
    },
};