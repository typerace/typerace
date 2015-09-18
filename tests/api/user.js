process.env.NODE_ENV = 'test';
process.env.NODE_PORT = '9001';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require("../../server");
var should = chai.should();
var expect = chai.expect;
chai.use(chaiHttp);

it('should respond to /users/check as guest', function(done) {
    chai.request(server)
        .get('/api/users/check')
        .end(function(err, res){
            expect(err).to.be.null;
            expect(res).to.have.status(401);
            done();
        });
});

it('should respond to incorrect login attempts', function(done) {
    chai.request(server)
        .post('/api/users/login', {
            'email': 'incorrect@email.com',
            'password': 'password',
        })
        .end(function(err, res){
            expect(err).to.be.null;
            expect(res).to.have.status(401);
            done();
        });
});

it('should respond to incorrect registration attempts', function(done) {
    chai.request(server)
        .post('/api/users/register', {
            'email': 'incorrectemail',
            'password': 'password',
        })
        .end(function(err, res){
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            done();
        });
});

it('should respond to incomplete registration attempts', function(done) {
    chai.request(server)
        .post('/api/users/register', {
            'email': 'incorrect@email.com',
            'password': 'password',
        })
        .end(function(err, res){
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            done();
        });
});