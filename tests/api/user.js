var model = require("../../api/models");
var api = require("supertest")("http://localhost:" + process.env.NODE_PORT);
require("../../server");

describe("/api/users endpoint", function () {
    var mock = {
        user: {
            email: "test@test.test",
            password: "test1",
        },
    };
    var cookie;

    // SETUP
    before("prepare a test user", function (done) {
        model.user.destroy({
            truncate: true,
            force: true,
        });
        model.user.create(mock.user).then(function () {
            done();
        });
    });

    // TEARDOWN
    after("remove the test user", function () {
        model.user.destroy({
            truncate: true,
            force: true,
        });
    });

    it("should respond to /users/check as guest", function (done) {
        api.get("/api/users/check").expect(401, done);
    });

    it("should respond to incorrect registration attempts", function (done) {
        api.post("/api/users/login")
            .send({
                "email": "incorrectemail",
                "password": "password",
            }).expect(401, done);
    });

    it("should respond to correct registration attempts", function (done) {
        api.post("/api/users/login")
            .send({
                "email": "correct@gmail.com",
                "password": "password1",
            }).expect(200)
            .expect("typerace.sid")
            .end(function (err, res) {
                cookie = res.headers["set-cookie"];
                done();
            });
    });

    it("should respond to /users/check as registered user after registration", function (done) {
        api.get("/api/users/check").set("cookie", cookie).expect(200, done);
    });

    it("should respond to incorrect login attempts", function (done) {
        api.post("/api/users/login")
            .send({
                "email": "correct@gmail.com",
                "password": "incorrectpassword",
            }).expect(401, done);
    });

    it("should respond to correct login attempts", function (done) {
        api.post("/api/users/login")
            .send({
                "email": "correct@gmail.com",
                "password": "password1",
            }).expect(200)
            .expect("typerace.sid")
            .end(function (err, res) {
                cookie = res.headers["set-cookie"];
                done();
            });
    });

    it("should respond to /users/check as registered user", function (done) {
        api.get("/api/users/check").set("cookie", cookie).expect(200, done);
    });

    it("should respond to correct logout attempts", function (done) {
        api.post("/api/users/logout").set("cookie", cookie).expect(200, done);
    });

    it("should respond to /users/check as guest again", function (done) {
        api.get("/api/users/check").set("cookie", cookie).expect(401, done);
    });

    it("should respond to correct login attempts (inserted)", function (done) {
        api.post("/api/users/login")
            .send({
                email: "test@test.test",
                password: "test1",
            })
            .expect(200)
            .expect("typerace.sid")
            .end(function (err, res) {
                cookie = res.headers["set-cookie"];
                done();
            });
    });

    it("should respond to /users/check as inserted user", function (done) {
        api.get("/api/users/check").set("cookie", cookie).expect(200, done);
    });

    it("should respond to correct logout attempts", function (done) {
        api.post("/api/users/logout").set("cookie", cookie).expect(200, done);
    });

    it("should respond to /users/check as guest again", function (done) {
        api.get("/api/users/check").set("cookie", cookie).expect(401, done);
    });
});
