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

// Temporary login check
router.get("/check", function(req, res) {
    res.send(req.user ? "logged in" : "not logged in");
});

module.exports = router;
