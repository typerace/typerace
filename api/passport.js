var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt-nodejs");
var model = require("./models");

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

            return done(null, user);
        }).catch(function(err) {
            return done(err);
        });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    // query the current user from database
    model.user.findById(id)
        .then(function(user) {
            done(null, user);
        }).catch(function() {
            done(new Error("User " + id + " does not exist"));
        });
});

passport.user = function(req, res, next) {
    if (req.user && req.user.status && req.user.status !== "banned") return next();
    return res.status(401).send();
};

passport.mod = function(req, res, next) {
    if (req.user && req.user.role === "mod") return next();
    return res.status(401).send();
};

passport.admin = function(req, res, next) {
    if (req.user && req.user.role === "admin") return next();
    return res.status(401).send();
};

module.exports = passport;
