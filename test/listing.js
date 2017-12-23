process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('/GET listings', () => {
  it('should get all job listings', () => {
    return new Promise((resolve) => {
      chai.request(app)
        .get('/listings')
        .then((res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          resolve();
        });
    });
  });
});

describe('/POST listings', () => {
  it('should create all listings', () => {
    return new Promise((resolve) => {
      chai.request(app)
        .post('listings/create/all')
        .then((res) => {
          res.should.have.status(200);
          resolve();
        });
    });
  });
});
