var express = require("express");
var router = express.Router();
var passport = require("passport");
var model = require("../models");

router.get("/", passport.access(["mod", "admin"]), function (req, res) {
    model.text.findAll().then(function (texts) {
        return res.json(texts);
    });
});

router.get("/:id", function (req, res, next) {
    var where = {
        where: {id: req.params.id},
    };

    if (!req.user.access(["mod", "admin"])) {
        where.where.user_id = req.user.id;
        where.where.status = "public";
    }

    model.text.find(where).then(function (text) {
        if (!text) return res.status(404).send();

        req.text = text;
        next();
    });
}, function (req, res) {
    res.json(req.text);
});

router.post("/", passport.access(["user", "mod", "admin"]), function (req, res, next) {
    var errors;

    req.checkBody("content", "Please enter the content.").notEmpty();
    req.checkBody("content", "Submissions must be at least 20 characters long.").len(20);
    req.checkBody("description", "Please add a description.").notEmpty();

    errors = req.validationErrors();
    if (errors) return res.status(400).json(errors);

    model.text.create({
        user_id: req.user.id,
        content: req.body.content,
        description: req.body.description || "",
        source_name: req.body.source_name || "",
        source_author: req.body.source_author || "",
        source_link: req.body.source_link || "",
        status: req.user.role === "user" ? "pending" : "public",
    }).catch(function (err) {
        return res.status(400).send(err);
    }).then(function (text) {
        req.text = text;
        next();
    });
}, function (req, res) {
    res.status(201).json(req.text);
});

router.put("/:id", passport.access(["mod", "admin"]), function (req, res, next) {
    model.text.find({where: {id: req.params.id}}).then(function (text) {
        var values;
        if (!text) return res.status(404).send();

        values = {};
        if (req.body.user_id) values.user_id = req.body.user_id;
        if (req.body.content) values.content = req.body.content;
        if (req.body.difficulty) values.difficulty = req.body.difficulty;
        if (req.body.description) values.description = req.body.description;
        if (req.body.source_name) values.source_name = req.body.source_name;
        if (req.body.source_author) values.source_author = req.body.source_author;
        if (req.body.source_link) values.source_link = req.body.source_link;
        if (req.body.status) values.status = req.body.status;

        text.update(values).catch(function (err) {
            return res.status(400).send(err);
        }).then(function () {
            req.text = text;
            next();
        });
    });
}, function (req, res) {
    res.json(req.text);
});

router.delete("/:id", passport.access(["mod", "admin"]), function (req, res, next) {
    model.text.find({where: {id: req.params.id}}).then(function (text) {
        if (!text) return res.status(404).send();

        text.destroy().then(function () {
            req.text = null;
            next();
        });
    });
}, function (req, res) {
    res.send();
});

module.exports = router;
