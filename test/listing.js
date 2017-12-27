process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('/POST listings', () => {
  it('should create all listings', () => {
    return new Promise((resolve, reject) => {
      chai.request(app)
        .post('/listings/create/all')
        .then((res) => {
          res.should.have.status(200);
          resolve();
        })
        .catch(err => reject(err));
    });
  });
});

describe('/GET listings', () => {
  it('should get all job listings', () => {
    return new Promise((resolve, reject) => {
      chai.request(app)
        .get('/listings')
        .then((res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          resolve();
        })
        .catch(err => reject(err));
    });
  });
});

describe('/DELETE listings', () => {
  it('should delete all listings', () => {
    return new Promise((resolve, reject) => {
      chai.request(app)
        .delete('/listings/all')
        .then((res) => {
          res.should.have.status(200);
          resolve();
        })
        .catch(err => reject(err));
    });
  });
});
