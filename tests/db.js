var model = require("../api/models");
var bcrypt = require("bcrypt-nodejs");

var tabledata = {
    users: {
        user: {
            email: "user@typerace.io",
            password: bcrypt.hashSync("user"),
            role: "user",
        },
        mod: {
            email: "mod@typerace.io",
            password: bcrypt.hashSync("mod"),
            role: "mod",
        },
        admin: {
            email: "admin@typerace.io",
            password: bcrypt.hashSync("admin"),
            role: "admin",
        },
    },
};

module.exports = {
    pullup: function () {
        // Build the db structure based on predefined mocks

        model.user.bulkCreate([mock.user, mock.mod, mock.admin])
            .then(function() {
                console.log('user table pulled up');
            }
        );



    },
    teardown: function () {
        // Trunc all tables

        model.user.destroy({
            truncate: true,
            force: true,
        });

    },
    rebuild: function () {
        this.teardown();
        this.pullup();
    }
};