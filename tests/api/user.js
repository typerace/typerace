var model = require("../../api/models");
var bcrypt = require("bcrypt-nodejs");
var api = require("supertest")("http://localhost:" + process.env.NODE_PORT);
require("../../server");

describe("/api/users endpoint", function () {
    var mock = {
        user: {
            email: "test@test.test",
            password: bcrypt.hashSync("test"),
        },
    };
    var cookie;

    // SETUP
    before("prepare a test user", function () {
        model.user.destroy({
            truncate: true,
            force: true,
        });
        model.user.create(mock.user);
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

    it("should respond to incorrect login attempts", function (done) {
        api.post("/api/users/login")
            .send({
                "email": "incorrect@email.com",
                "password": "password",
            }).expect(401, done);
    });

    it("should respond to incorrect registration attempts", function (done) {
        api.post("/api/users/register")
            .send({
                "email": "incorrectemail",
                "password": "password",
                "password2": "password",
            }).expect(400, done);
    });

    it("should respond to incomplete registration attempts", function (done) {
        api.post("/api/users/register")
            .send({
                "email": "incorrect@email.com",
                "password": "password",
            }).expect(400, done);
    });


    it("should respond to correct registration attempts", function (done) {
        api.post("/api/users/register")
            .send({
                "email": "correct@gmail.com",
                "password": "password1",
                "password2": "password1",
            }).expect(201, done);
    });

    it("should respond to duplicate registration attempts", function (done) {
        api.post("/api/users/register")
            .send({
                "email": "correct@gmail.com",
                "password": "password1",
                "password2": "password1",
            }).expect(400, done);
    });

    it("should respond to correct login attempts (registered user)", function (done) {
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

    it("should respond to correct login attempts (inserted user)", function (done) {
        api.post("/api/users/login")
            .send({
                "email": "test@test.test",
                "password": "test",
            }).expect(200)
            .expect("typerace.sid")
            .end(function (err, res) {
                cookie = res.headers["set-cookie"];
                done();
            });
    });

    it("should respond to /users/check as user", function (done) {
        api.get("/api/users/check").set("cookie", cookie).expect(200, done);
    });

    it("should respond to correct logout attempts", function (done) {
        api.post("/api/users/logout").set("cookie", cookie).expect(200, done);
    });

    it("should respond to /users/check as guest again", function (done) {
        api.get("/api/users/check").set("cookie", cookie).expect(401, done);
    });
});
