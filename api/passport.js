var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt-nodejs");
var model = require("./models");
var util  = require("./utils");

passport.use(new LocalStrategy({
    // set the field name here
    usernameField: "email",
    passwordField: "password",
},
function(username, password, done) {
    model.user
        .find({where: {email: username}})
        .then(function(user) {
            if (!user)
                return done(null, false, {message: "The user does not exist"});
            if (!bcrypt.compareSync(password, user.password))
                return done(null, false, {message: "Wrong password"});

            user.sessionkey = util.generateHash(3);
            return done(null, user);
        }).catch(function(err) {
            return done(err);
        });
}));

passport.serializeUser(function(user, done) {
    // second param is the obj, passed as first param to deserializeUser
    done(null, {id: user.id, key: user.sessionkey});
});

passport.deserializeUser(function(obj, done) {
    // query the current user from database
    model.user.find({
        where: {
            id: obj.id,
            sessionkey: obj.key,
        },
        attributes: ["id", "role", "status"],
    }).then(function(user) {
        done(null, user);
    }).catch(function() {
        done(new Error("User " + obj.id + " does not exist"));
    });
});

passport.user = function(req, res, next) {
    if (req.user && req.user.status && req.user.status !== "banned") return next();
    return res.status(401).send();
};

passport.mod = function(req, res, next) {
    if (req.user && req.user.role === "mod") return next();
    return res.status(403).send();
};

passport.admin = function(req, res, next) {
    if (req.user && req.user.role === "admin") return next();
    return res.status(403).send();
};

module.exports = passport;
