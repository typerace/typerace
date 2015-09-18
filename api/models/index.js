"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");

var env = process.env.NODE_ENV || "dev";
var config = require(__dirname + "/../config/" + env).db;
var db = new Sequelize(config.database, config.username, config.password, config);

var obj = {};

fs.readdirSync(__dirname).map(function(file) {
    var model;
    if (file.indexOf(".") === 0 || file === "index.js") return;
    model = db.import(path.join(__dirname, file));
    obj[model.name] = model;
});

Object.keys(obj).map(function(key) {
    if ("associate" in obj[key]) obj[key].associate(obj);
});

obj.sequelize = db;
obj.Sequelize = Sequelize;

module.exports = obj;
