var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var model = require("./models");
var utils = require("./utils");

passport.use(new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
    },
    function (username, password, done) {
        model.user
            .find({where: {email: username}})
            .then(function (user) {
                if (!user)
                    return done(null, false, {message: "The user does not exist"});
                if (!user.verifyPassword(password))
                    return done(null, false, {message: "Wrong password"});

                user.sessionkey = utils.generateHash(3);
                return done(null, user);
            }).catch(function (err) {
                return done(err);
            });
    }));

passport.serializeUser(function (user, done) {
    // second param is the obj, passed as first param to deserializeUser
    done(null, {id: user.id, key: user.sessionkey});
});

passport.deserializeUser(function (obj, done) {
    // query the current user from database
    model.user.find({
        where: {
            id: obj.id,
            sessionkey: obj.key,
        },
        attributes: ["id", "role", "status"],
    }).then(function (user) {
        done(null, user);
    }).catch(function () {
        done(new Error("User " + obj.id + " does not exist"));
    });
});

passport.access = function (levels, customStatus) {
    return function (req, res, next) {
        if (req.user && req.user.access(levels)) return next();
        return res.status(customStatus || 403).send();
    };
};

passport.guest = function (req, res, next) {
    if (!req.user) return next();
    return res.status(403).send();
};

passport.user = function (req, res, next) {
    if (req.user && req.user.status !== "banned") return next();
    return res.status(401).send();
};

passport.mod = function (req, res, next) {
    return passport.access(["mod"])(req, res, next);
};

passport.admin = function (req, res, next) {
    return passport.access(["admin"])(req, res, next);
};

module.exports = passport;
