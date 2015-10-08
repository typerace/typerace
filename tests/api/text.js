var model = require("../../api/models");
var api = require("supertest")("http://localhost:" + process.env.NODE_PORT);
var expect = require("chai").expect;
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
    var users = {};
    var texts = {};

    // SETUP
    before("prepare test user and text db", function (done) {
        this.timeout(10000);

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

                        users.user = resUser.body;
                        users.mod = resMod.body;
                        users.admin = resAdmin.body;

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

    describe("as user", function () {
        it("should respond to /texts", function (done) {
            api.get("/api/texts").set("cookie", cookies.user).expect(403, done);
        });

        it("should create text on /texts/", function (done) {
            api.post("/api/texts")
                .set("cookie", cookies.user)
                .send({
                    "content": "Lorem ipsum dolor sit amet.",
                    "description": "Sample text #user",
                })
                .expect(201)
                .expect(function (res) {
                    expect(res.body).to.have.property("id");
                    expect(res.body).to.have.property("user_id", users.user.id);
                    expect(res.body).to.have.property("content", "Lorem ipsum dolor sit amet.");
                    expect(res.body).to.have.property("description", "Sample text #user");
                    expect(res.body).to.have.property("source_name", "");
                    expect(res.body).to.have.property("source_author", "");
                    expect(res.body).to.have.property("source_link", "");
                    expect(res.body).to.have.property("status", "pending");
                })
                .end(function (err, res) {
                    texts.user = res.body;
                    done(err);
                });
        });

        it("should respond to /texts/id", function (done) {
            api.get("/api/texts/" + texts.user.id).set("cookie", cookies.user).expect(404, done);
        });
    });

    it("should respond to /texts as mod", function (done) {
        api.get("/api/texts").set("cookie", cookies.mod).expect(200, done);
    });

    // Getting on with Admin since it has the same access as mod

    describe("as admin", function () {
        it("should respond to /texts", function (done) {
            api.get("/api/texts").set("cookie", cookies.admin).expect(200, done);
        });

        it("should respond to /texts/0", function (done) {
            api.get("/api/texts/0").set("cookie", cookies.admin).expect(404, done);
        });

        // POST / content, description, source_name, source_author, source_link
        it("should respond creating empty text on /texts/", function (done) {
            api.post("/api/texts/").set("cookie", cookies.admin).expect(400, done);
        });

        it("should create text on /texts/", function (done) {
            api.post("/api/texts/")
                .set("cookie", cookies.admin)
                .send({
                    "content": "Lorem ipsum dolor sit amet.",
                    "description": "Sample text #admin",
                })
                .expect(201)
                .expect(function (res) {
                    expect(res.body).to.have.property("id");
                    expect(res.body).to.have.property("user_id", users.admin.id);
                    expect(res.body).to.have.property("content", "Lorem ipsum dolor sit amet.");
                    expect(res.body).to.have.property("description", "Sample text #admin");
                    expect(res.body).to.have.property("source_name", "");
                    expect(res.body).to.have.property("source_author", "");
                    expect(res.body).to.have.property("source_link", "");
                    expect(res.body).to.have.property("status", "public");
                })
                .end(function (err, res) {
                    texts.admin = res.body;
                    done(err);
                });
        });

        it("should get the created text on /texts/id", function (done) {
            api.get("/api/texts/" + texts.admin.id)
                .set("cookie", cookies.admin)
                .expect(200)
                .expect(function (res) {
                    expect(res.body).to.have.property("id", texts.admin.id);
                })
                .end(done);
        });

        it("should respond to update on /texts/wrong-id", function (done) {
            api.put("/api/texts/0").set("cookie", cookies.admin).expect(404, done);
        });

        it("should respond to update on /texts/id", function (done) {
            api.put("/api/texts/" + texts.admin.id).set("cookie", cookies.admin)
                .send({difficulty: "asdasd"})
                .expect(400, done);
        });

        it("should update text on /texts/id", function (done) {
            api.put("/api/texts/" + texts.admin.id).set("cookie", cookies.admin)
                .send({difficulty: 20})
                .expect(200)
                .expect(function (res) {
                    expect(res.body).to.have.property("difficulty", 20);
                })
                .end(function (err, res) {
                    texts.admin = res.body;
                    done(err);
                });
        });

        // DELETE /:id
        it("should respond to delete /texts/wrong-id", function (done) {
            api.delete("/api/texts/0").set("cookie", cookies.admin).expect(404, done);
        });

        it("should delete text on /texts/id", function (done) {
            api.delete("/api/texts/" + texts.admin.id).set("cookie", cookies.admin).expect(200, done);
        });

        it("should respond to /texts/id", function (done) {
            api.get("/api/texts/" + texts.admin.id).set("cookie", cookies.admin).expect(404, done);
        });
    });
});
