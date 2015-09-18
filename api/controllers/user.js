var express = require("express");
var router = express.Router();
var model  = require("../models");
// var bcrypt = require("bcrypt-nodejs");
var passport = require("passport");
// var mailer = require("../config/mailer.js");
// var utils  = require("../utils");
// var moment = require("moment");

router.post("/login", function(req, res, next) {
    passport.authenticate("local", function(err, userdata, info) {
        if (err) return res.status(401).send("Authentication failed.");
        if (info) return res.status(401).send(info.message);

        req.login(userdata, function(error) {
            if (error) return res.status(401).send("Login failed.");

            model.user.find({
                where: {
                    id: req.user.id,
                },
            }).then(function(user) {
                if (!user) return res.status(500).send();
                user.password = null;
                return res.json(user);
            });
        });
    })(req, res, next);
});

router.post("/logout", function(req, res) {
    req.logout();
    return res.send("logout successful");
});

router.post("/register", function(req, res, next) {
    var errors = req.validationErrors() || [];

    req.checkBody("email", "Please enter your e-mail.").notEmpty();
    req.checkBody("email", "Please enter a valid e-mail address.").isEmail();
    req.checkBody("password", "Please enter your password.").notEmpty();
    req.checkBody("password", "Your password must be at least 5 characters long.").len(5);
    req.checkBody("password2", "Please repeat your password.").equals(req.body.password);

    // Check if email is unique.
    model.user.find({where: {email: req.body.email}}).then(function(row) {
        if (row !== null) {
            errors.push({
                param: "email",
                msg: "This e-mail address has already been registered.",
                value: req.body.email,
            });
        }
    }).then(function() {
        if (errors.length) return res.status(400).json(errors);
        next();
    });
}, function(req, res) {
    model.user.create({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
    });
    res.send();
});

// Temporary login check
router.get("/check", function(req, res) {
    res.send(req.user ? "logged in" : "not logged in");
});

module.exports = router;
