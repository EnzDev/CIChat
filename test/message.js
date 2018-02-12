//During the test the env variable is set to test 
process.env.NODE_ENV = 'test'; 
 
var mongoose = require('mongoose');  
// let Message = require('../model/Message');

var autoIncrement = require('mongoose-auto-increment');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let expect = chai.expect

let server = require('../index');

let User = require('../model/User')

chai.use(chaiHttp);

describe('Message', () => {
    let Message = require('../model/Message')
    beforeEach((done) => { //Before each test we empty the database
        Message.find({}).remove(() => { 
            User.find({}).remove(()=>done())
        })
  })

    /*
     * Test the /GET route
     */
    describe('/GET Message', () => {
        it('it should GET all the Messages.', (done) => {
            chai.request(server)
            .get('/message')
            .end((err, res) => {
                expect(res.status).to.equal(200)
                res.body.should.be.a('object')
                res.body.messages.should.be.a('array')
                res.body.messages.length.should.be.eql(0)
                done()
            })
        })
    })

    /*
     * Create a user and send a message
     */
    describe('/POST Message', () => {
        it('it should add a message and be stored in the db.', (done) => {
            chai.request(server)
            .post('/user/register')
            .send({ user: 'username', password:'password'})
            .end((err, res) => {
                res.body.should.have.property('token')
                chai.request(server)
                .post('/message')
                .set('x-token', res.body.token)
                .send({ message:'Hi there !' })
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body.status.error).to.equal(false)
                    chai.request(server)
                    .get('/message')
                    .end((err, res) => {
                        expect(res.status).to.equal(200)
                        res.body.should.be.a('object')
                        res.body.messages.should.be.a('array')
                        res.body.messages.length.should.be.eql(1)
                        done()
                    })
                })
            })
        })
    })
})