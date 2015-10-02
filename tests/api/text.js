var model = require("../../api/models");
var bcrypt = require("bcrypt-nodejs");
var api = require("supertest")("http://localhost:" + process.env.NODE_PORT);
require("../../server");

describe("/api/texts endpoint", function () {
    var mock = {
        user: {
            email: "user@test.test",
            password: "user",
        },
        admin: {
            email: "admin@test.test",
            password: "admin",
            role: "admin",
        },
    };
    var cookies = {};

    // SETUP
    before("prepare test users, log in and save cookies", function (done) {
        model.user.destroy({
            truncate: true,
            force: true,
        });
        model.user.bulkCreate([mock.user, mock.admin]).then(function () {
            api.post("/api/users/login")
                .send({"email": mock.user.email, "password": "user"})
                .end(function (err, res) {
                    cookies.user = res.headers["set-cookie"];
                });

            api.post("/api/users/login")
                .send({"email": mock.admin.email, "password": "admin"})
                .end(function (err, res) {
                    cookies.admin = res.headers["set-cookie"];
                    done();
                });
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
        api.get("/api/texts").set("cookie", cookies.user).expect(403, done);
    });

    it("should respond to /texts as admin", function (done) {
        api.get("/api/texts").set("cookie", cookies.admin).expect(200, done);
    });
});
