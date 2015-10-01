var express = require("express");
var router = express.Router();
var passport = require("passport");
var model = require("../models");

router.get("/", passport.user, function (req, res) {
    var where = {};
    if (req.user.role !== "admin") {
        where = {
            where: {user_id: req.user.id},
        };
    }
    model.text.findAll(where).then(function (texts) {
        return res.json(texts);
    });
});

router.post("/", passport.user, function (req, res, next) {
    var errors;
    var difficulty = 0; // temp

    req.checkBody("content", "Please enter the content.").notEmpty();
    req.checkBody("content", "Submissions must be at least 20 characters long.").len(20);
    req.checkBody("description", "Please add a description.").notEmpty();

    errors = req.validationErrors();
    if (errors) return res.status(400).json(errors);

    model.text.create({
        user_id: req.user.id,
        content: req.body.content,
        description: req.body.description || "",
        difficulty: difficulty,
        source_name: req.body.source_name || "",
        source_author: req.body.source_author || "",
        source_link: req.body.source_link || "",
    }).then(function (text) {
        req.text = text;
        next();
    });
}, function (req, res) {
    res.status(201).send(req.text);
});

module.exports = router;
