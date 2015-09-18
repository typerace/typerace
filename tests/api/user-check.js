process.env.NODE_ENV = 'test';
process.env.NODE_PORT = '9001';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require("../../server");
var should = chai.should();
var expect = chai.expect;
chai.use(chaiHttp);

it('should correctly respond to /users/check', function(done) {
    chai.request(server)
        .get('/api/users/check')
        .end(function(err, res){
            expect(err).to.be.null;
            expect(res).to.have.status(401);
            done();
        });
});