var chai = require("chai");
var model = require("../../api/models");
var bcrypt = require("bcrypt-nodejs");
var api = require("supertest")("http://localhost:" + process.env.NODE_PORT);
var expect = chai.expect;
require("../../server");

describe("/api/texts endpoint", function () {
    var mock = {
        user: {
            email: "user@test.test",
            password: bcrypt.hashSync("user"),
        },
        admin: {
            email: "admin@test.test",
            password: bcrypt.hashSync("admin"),
            role: "admin",
        },
    };
    var cookies = {};

    // SETUP
    before("prepare a test users, log in and save cookies", function (done) {
        model.user.destroy({
            truncate: true,
            force: true,
        });
        model.user.create(mock.user);

        api.post("/api/users/login")
            .send({
                "email": mock.user.email,
                "password": "user",
            })
            .end(function (err, res) {
                cookies.user = res.headers["set-cookie"];
                done();
            });

    });

    // TEARDOWN
    after("remove the test users", function () {
        model.user.destroy({
            truncate: true,
            force: true,
        });
    });

    it("should respond to /texts as user", function (done) {
        api.get("/api/texts").set("cookie", cookies.user).expect(401, done);
    });
});
