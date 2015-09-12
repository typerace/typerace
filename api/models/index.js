"use strict";

var fs = require("fs");
var path = require("path");
var sequelize = require("sequelize");
var args = require('node-args');

var env = process.env.NODE_ENV || args.e || args.env || "development";
var config = require(__dirname + '/../config/_db')[env];
var db = new sequelize(config.database, config.username, config.password, config);

var obj = {};

fs.readdirSync(__dirname).map(function (file) {
    if (file.indexOf(".") === 0 || file === "index.js") return;
    var model = db["import"](path.join(__dirname, file));
    obj[model.name] = model;
});

Object.keys(obj).map(function (key) {
    if ("associate" in obj[key]) obj[key].associate(obj);
});

obj.sequelize = db;
obj.Sequelize = sequelize;

module.exports = obj;