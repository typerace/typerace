var path = require('path');
var bodyParser = require('body-parser');
var validator = require('express-validator');

module.exports = function(express, app, controller) {

    // Prepare the validator
    app.use(validator());

    // Static bindings
    app.use('/css', express.static(path.join(__dirname, '../public/css')));
    app.use('/js', express.static(path.join(__dirname, '../public/js')));
    app.use('/img', express.static(path.join(__dirname, '../public/img')));
    app.use('/font', express.static(path.join(__dirname, '../public/font')));
    app.use('/template', express.static(path.join(__dirname, '../templates')));

    // Controllers
    // app.use('/api/users', controller.user);

    // root path
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '../templates', 'index.html'));
    });

    // 404 catch-all
    app.get('*', function (req, res) {
        res.redirect('/');
    });
};