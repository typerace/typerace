module.exports = {
    generateHash: function(segments) {
        var hash = [];
        while (segments--) hash.push(Math.random().toString(36).substring(2));
        return hash.join('-');
    }
};