process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const User = require('../app/models/user');

const should = chai.should();
const assert = chai.assert;

chai.use(chaiHttp);

const userData = {
  id: '12345679',
  login: 'TestUser',
};
const currentUser = {
  userId: {
    N: userData.id,
  },
};

describe('User actions', () => {
  before(() => {
    User.createUser(userData, process.env.TEST_TOKEN)
      .then(data => console.log(data))
      .catch(err => console.log(err));
  });

  describe('/GET login', () => {
    it('should redirect to Github', () => {
      return new Promise((resolve, reject) => {
        chai.request(app)
          .get('/users/login')
          .then((res) => {
            res.should.have.status(200);
            // res.headers.server.should.equal('GitHub.com');
            resolve();
          })
          .catch(err => reject(err));
      });
    });
  });

  describe('/GET validate', () => {
    it('should validate auth and respond with 200', () => {
      return new Promise((resolve, reject) => {
        chai.request(app)
          .get('/users/validate')
          .set('authtoken', process.env.TEST_TOKEN)
          .then((res) => {
            res.should.have.status(200);
            resolve();
          })
          .catch(err => reject(err));
      });
    });
  });

  describe('/POST logout', () => {
    it('should delete the token from dynamo', () => {
      return new Promise((resolve, reject) => {
        chai.request(app)
          .post('/users/logout')
          .set('authtoken', process.env.TEST_TOKEN)
          .then((res) => {
            res.should.have.status(200);
            assert.equal(res.body.Attributes.userName.S, 'TestUser');
            assert.equal(res.body.Attributes.authToken.S, 'None');
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
