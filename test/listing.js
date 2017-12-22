process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('/GET listings', () => {
  it('should get all job listings', (done) => {
    chai.request(app)
      .get('/listings')
      .end((err, res) => {
        res.status.have.status(200);
      done();
      });
  });
});
