//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

var autoIncrement = require('mongoose-auto-increment');
var mongoose = require('mongoose'); 
let User = require('../model/User');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let expect = chai.expect

let server = require('../index');



chai.use(chaiHttp);
//Our parent block
describe('Users', () => {
    beforeEach((done) => { //Before each test we empty the database
      User.find({}).remove(() => { 
        done()
     })
  })

/*
  * Test the /GET route
  */
  describe('/GET User', () => {
      it('it should GET all the User.', (done) => {
        chai.request(server)
            .get('/user')
            .end((err, res) => {
                expect(res.status).to.equal(200)
                res.body.should.be.a('object')
                res.body.users.should.be.a('array')
                res.body.users.length.should.be.eql(0)
              done()
            })
      })
  })

  /*
  * Test the /POST register
  */
  describe('/POST User/register', () => {
    it('it should return 200 with a token.', (done) => {
      chai.request(server)
        .post('/user/register')
        .send({ user: 'username', password:'password'})
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('status')
          res.body.should.have.property('token')
          expect(res.body.status.error).to.equal(false)
          done()
        })
    })
    it('it should refuse to register twice with a 409.', (done) => {
      chai.request(server)
      .post('/user/register')
      .send({ user: 'username', password:'password'})
      .end(() => {
        chai.request(server)
        .post('/user/register')
        .send({ user: 'username', password:'password'})
        .end((err, res) => {
          res.should.have.status(409)
          expect(res.body.status.error).to.equal(true)
          done()
        })
      })

    })
  })

  // GET with a registred user
  describe('/GET User', () => {
    it('it should GET all the User.', (done) => {
      chai.request(server)
      .post('/user/register')
      .send({ user: 'username', password:'password'})
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('status')
        res.body.should.have.property('token')
        expect(res.body.status.error).to.equal(false)
        
        chai.request(server)
        .get('/user')
        .end((err, res) => {
            expect(res.status).to.equal(200)
            res.body.should.be.a('object')
            res.body.users.should.be.a('array')
            res.body.users.length.should.be.eql(1)
          done()
        })

      })
    })
})


})