var expect = require("chai").expect;

function getCookies(res) {
    var cookies = res.headers["set-cookie"] || [];

    return cookies.reduce(function (obj, cookie) {
        var cookieArray = cookie.split(";").shift().trim().split("=");
        var cookieName = cookieArray.shift();
        var cookieValue = cookieArray.join("=");

        if (!cookieName) return obj;

        try {
            obj[cookieName] = JSON.parse(cookieValue);
        } catch (err) {
            obj[cookieName] = cookieValue;
        }

        return obj;
    }, {});
}

module.exports = function () {
    var args = [].slice.call(arguments);
    return function (res) {
        if (!res.cookies) res.cookies = getCookies(res);

        if (args.length === 1) expect(res.cookies).to.have.ownProperty(args[0]);
        else expect(res.cookies).to.have.property(args[0], args[1]);
    };
};