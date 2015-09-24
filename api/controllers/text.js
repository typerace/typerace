var express = require("express");
var router = express.Router();
// var model  = require("../models");
var passport = require("passport");
var model  = require("../models");

router.get("/", passport.user,  function(req, res) {
    model.text.findAll({
        where: {user_id: req.user.id},
    }).then(function(texts) {
        return res.json(texts);
    });
});

module.exports = router;
