var model = require("../../api/models");
var api = require("supertest")("http://localhost:" + process.env.NODE_PORT);
require("../../server");

describe("/api/texts endpoint", function () {
    var mock = {
        user: {
            email: "user@test.test",
            password: "user1",
        },
        mod: {
            email: "mod@test.test",
            password: "moderator1",
            role: "mod",
        },
        admin: {
            email: "admin@test.test",
            password: "admin1",
            role: "admin",
        },
    };

    var cookies = {};

    // SETUP
    before("prepare test user and text db", function (done) {
        this.timeout(5000);

        model.user.destroy({
            truncate: true,
            force: true,
        });

        model.text.destroy({
            truncate: true,
            force: true,
        });

        model.user.bulkCreate([mock.user, mock.mod, mock.admin]).then(function () {
            api.post("/api/users/login").send(mock.user).end(function (errUser, resUser) {
                api.post("/api/users/login").send(mock.mod).end(function (errMod, resMod) {
                    api.post("/api/users/login").send(mock.admin).end(function (errAdmin, resAdmin) {
                        cookies.user = resUser.headers["set-cookie"];
                        cookies.mod = resMod.headers["set-cookie"];
                        cookies.admin = resAdmin.headers["set-cookie"];

                        done();
                    });
                });
            });
        });
    });

    // TEARDOWN
    after("remove the test users, remote the test texts", function () {
        model.user.destroy({
            truncate: true,
            force: true,
        });

        model.text.destroy({
            truncate: true,
            force: true,
        });
    });

    it("should respond to /texts as user", function (done) {
        api.get("/api/texts").set("cookie", cookies.user).expect(403, done);
    });

    it("should respond to /texts as mod", function (done) {
        api.get("/api/texts").set("cookie", cookies.mod).expect(200, done);
    });

    it("should respond to /texts as admin", function (done) {
        api.get("/api/texts").set("cookie", cookies.admin).expect(200, done);
    });

    // Working towards with admin
    it("should respond to /texts/0", function (done) {
        api.get("/api/texts/0").set("cookie", cookies.admin).expect(404, done);
    });
});
