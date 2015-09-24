var express = require("express");
var router = express.Router();
// var model  = require("../models");
var passport = require("passport");
var model  = require("../models");

router.get("/", passport.user,  function(req, res, next) {
    model.text.findAll({
        where: {user_id: req.user.id}
    }).then(function(r) {
        return res.json(r);
    });
});

module.exports = router;
