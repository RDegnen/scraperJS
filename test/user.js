process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('/GET login', () => {
  it('should redirect to Github', () => {
    return new Promise((resolve, reject) => {
      chai.request(app)
        .get('/users/login')
        .then((res) => {
          res.should.have.status(200);
          res.headers.server.should.equal('GitHub.com');
          resolve();
        })
        .catch(err => reject(err));
    });
  });
});
