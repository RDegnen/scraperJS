process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const User = require('../app/models/user');

const should = chai.should();
chai.use(chaiHttp);

describe('Listing actions', () => {
  const userData = {
    id: '12345679123456',
    login: 'ListingsTestUser',
  };
  const currentUser = {
    userId: {
      N: userData.id,
    },
  };

  before((done) => {
    User.createUser(userData, process.env.TEST_TOKEN_2)
      .then((data) => {
        console.log(data);
        done();
      })
      .catch(err => console.log(err));
  });

  describe('/POST listings', () => {
    it('should create all listings', () => {
      return new Promise((resolve, reject) => {
        chai.request(app)
          .post('/listings/create/all')
          .set('authtoken', process.env.TEST_TOKEN_2)
          .then((res) => {
            res.should.have.status(200);
            setTimeout(() => {
              resolve();
            }, 1000);
          })
          .catch(err => reject(err));
      });
    });
  });

  describe('/GET listings', () => {
    it('should get all job listings', () => {
      return new Promise((resolve, reject) => {
        chai.request(app)
          .get('/listings/all')
          .set('authtoken', process.env.TEST_TOKEN_2)
          .then((res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.Items.should.have.lengthOf(92);
            resolve();
          })
          .catch(err => reject(err));
      });
    });
  });

  describe('/GET listings with invalid token', () => {
    it('return with a 401', () => {
      return new Promise((resolve, reject) => {
        chai.request(app)
          .get('/listings/all')
          .set('authtoken', 'invalid_token')
          .then((res) => {
            console.log(res);
            reject();
          })
          .catch((err) => {
            err.should.have.status(401);
            resolve();
          });
      });
    });
  });

  describe('/Get all source listings', () => {
    it('should get all indeed listings', () => {
      return new Promise((resolve, reject) => {
        chai.request(app)
          .get('/listings/indeed')
          .set('authtoken', process.env.TEST_TOKEN_2)
          .then((res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.Items.should.have.lengthOf(10);
            resolve();
          })
          .catch(err => reject(err));
      });
    });
  });

  describe('/Get all user listings', () => {
    it('should get all listings by user', () => {
      return new Promise((resolve, reject) => {
        chai.request(app)
          .get('/listings/get/user')
          .set('authtoken', process.env.TEST_TOKEN_2)
          .then((res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.Items.should.have.lengthOf(92);
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
          .delete('/listings/destroy/all')
          .set('authtoken', process.env.TEST_TOKEN_2)
          .then((res) => {
            res.should.have.status(200);
            resolve();
          })
          .catch(err => reject(err));
      });
    });
  });

  after(() => {
    User.destroyUser(currentUser)
      .then(data => console.log(data))
      .catch(err => console.log(err));
  });
});
