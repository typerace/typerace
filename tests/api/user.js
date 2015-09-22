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

    // SETUP
    before("prepare a test user", function() {
        model.user.create(mock.user);
    });

    // TEARDOWN
    after("remove the test user", function() {
        model.user.destroy({
            where: {
                email: mock.user.email,
            },
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
            .post("/api/users/login", {
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
            .post("/api/users/register", {
                "email": "incorrectemail",
                "password": "password",
            })
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
            });
    });

    it("should respond to incomplete registration attempts", function(done) {
        chai.request(server)
            .post("/api/users/register", {
                "email": "incorrect@email.com",
                "password": "password",
            })
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
            });
    });
});
