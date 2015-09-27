var express = require("express");
var router = express.Router();
var model = require("../models");
var bcrypt = require("bcrypt-nodejs");
var passport = require("passport");
// var mailer = require("../config/mailer.js");
// var utils  = require("../utils");
// var moment = require("moment");

router.post("/login", function (req, res, next) {
    var errors;

    req.checkBody("email", "Please enter your e-mail.").notEmpty();
    req.checkBody("email", "Please enter a valid e-mail address.").isEmail();
    req.checkBody("password", "Please enter your password.").notEmpty();
    req.checkBody("password", "Your password must be at least 5 characters long.").len(5);

    errors = req.validationErrors();
    if (errors) return res.status(401).json(errors);

    model.user.find({where: {email: req.body.email}}).then(function (row) {
        if (row !== null) return next();

        model.user.create({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password),
        }).then(function () {
            next();
        });
    });
}, function (req, res, next) {
    passport.authenticate("local", function (err, userdata, info) {
        if (err) return res.status(401).send("Authentication failed.");
        if (info) return res.status(401).send(info.message);

        req.login(userdata, function (error) {
            if (error) return res.status(401).send("Login failed.");

            req.user = userdata;
            next();
        });
    })(req, res, next);
}, function (req, res, next) {
    req.user.update({
        sessionkey: req.user.sessionkey || "",
    }).then(function () {
        next();
    });
}, function (req, res) {
    req.user.password = null;
    return res.json(req.user);
});

router.post("/logout", passport.user, function (req, res, next) {
    model.user.update({
        sessionkey: "---",
    }, {
        where: {id: req.user.id},
    }).then(function () {
        req.session.destroy(function () {
            req.session = null;
            next();
        });
    });
}, function (req, res) {
    req.logout();
    return res.send();
});

// Temporary login check
router.get("/check", passport.user, function (req, res) {
    res.send();
});

module.exports = router;
