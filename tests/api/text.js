var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../../server");
var model  = require("../../api/models");
var bcrypt = require("bcrypt-nodejs");
var expect = chai.expect;
chai.use(chaiHttp);

describe("/api/users endpoint", function() {
    var mock = {
        user: {
            email: "test@test.test",
            password: bcrypt.hashSync("test"),
        },
    };
    var cookie;

    // SETUP
    before("prepare a test user", function() {
        model.user.destroy({
            truncate: true,
            force: true,
        });
        model.user.create(mock.user);
    });

    // TEARDOWN
    after("remove the test user", function() {
        model.user.destroy({
            truncate: true,
            force: true,
        });
    });

    it("should respond to /users/check as guest", function(done) {
        chai.request(server)
            .get("/api/users/check")
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(401);
                done();
            });
    });

    it("should respond to incorrect login attempts", function(done) {
        chai.request(server)
            .post("/api/users/login")
            .send({
                "email": "incorrect@email.com",
                "password": "password",
            })
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(401);
                done();
            });
    });

    it("should respond to incorrect registration attempts", function(done) {
        chai.request(server)
            .post("/api/users/register")
            .send({
                "email": "incorrectemail",
                "password": "password",
                "password2": "password",
            })
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
            });
    });

    it("should respond to incomplete registration attempts", function(done) {
        chai.request(server)
            .post("/api/users/register")
            .send({
                "email": "incorrect@email.com",
                "password": "password",
            })
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
            });
    });


    it("should respond to correct registration attempts", function(done) {
        chai.request(server)
            .post("/api/users/register")
            .send({
                "email": "correct@gmail.com",
                "password": "password1",
                "password2": "password1",
            })
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                done();
            });
    });

    it("should respond to duplicate registration attempts", function(done) {
        chai.request(server)
            .post("/api/users/register")
            .send({
                "email": "correct@gmail.com",
                "password": "password1",
                "password2": "password1",
            })
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
            });
    });

    it("should respond to correct login attempts", function(done) {
        chai.request(server)
            .post("/api/users/login")
            .send({
                "email": "correct@gmail.com",
                "password": "password1",
            })
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.cookie("typerace.sid");
                expect(res).to.have.status(200);
                cookie = res.headers["set-cookie"];
                done();
            });
    });

    it("should respond to /users/check as user", function(done) {
        chai.request(server)
            .get("/api/users/check")
            .set("cookie", cookie)
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });

    it("should respond to correct logout attempts", function(done) {
        chai.request(server)
            .post("/api/users/logout")
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });
});