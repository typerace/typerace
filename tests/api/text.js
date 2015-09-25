var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../../server");
var model = require("../../api/models");
var bcrypt = require("bcrypt-nodejs");
var expect = chai.expect;
chai.use(chaiHttp);

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


        chai.request(server)
            .post("/api/users/login")
            .send({
                "email": mock.admin.email,
                "password": "admin",
            })
            .end(function (err, res) {
                cookies.admin = res.headers["set-cookie"];
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
        chai.request(server)
            .get("/api/texts")
            .set("cookie", cookies.user)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(403);
                done();
            });
    });
});
