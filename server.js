var express = require('express');
var app = express();
var server = require('http').Server(app);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var compress = require('compression');

app.use(session({
    secret: 'cnPP86v8BH59HG5nf48y',
    key: 'typerace.sid',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(compress());

var passport = require('./api/passport.js');
app.use(passport.initialize());
app.use(passport.session());

var controller = require('./api/controllers');
var routes = require('./api/routes.js')(express, app, controller, passport);

server.listen(process.env.NODE_PORT || 80);

module.exports = app;