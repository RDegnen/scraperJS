process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const User = require('../app/models/user');
const AWS = require('aws-sdk');
const Scraper = require('../app/models/scraper');

const s3 = new AWS.S3();
chai.use(chaiHttp);
// Doing all this so I don't have to scrape Craigslist and Indeed everytime
// I run some tests!
function getCraigslistHtml() {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: 'ross-storage-bucket',
      Key: 'craigslist.html',
    };
    s3.getObject(params, (err, data) => {
      if (err) reject(err);
      const htmlString = data.Body.toString();
      resolve(htmlString);
    });
  });
}

function getIndeedHtml() {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: 'ross-storage-bucket',
      Key: 'indeed.html',
    };
    s3.getObject(params, (err, data) => {
      if (err) reject(err);
      const htmlString = data.Body.toString();
      resolve(htmlString);
    });
  });
}

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
    const req = {
      currentUser,
      body: {
        location: 'boston',
      },
    };
    User.createUser(userData, process.env.TEST_TOKEN_2)
      .then((data) => {
        console.log(data);
      })
      .catch(err => console.log(err));

    Promise.all([getCraigslistHtml(), getIndeedHtml()])
      .then(data => Scraper.scrapeAll(req, data))
      .then(data => Scraper.writeListings(data))
      .then((resp) => {
        console.log(resp);
        done();
      })
      .catch(err => console.log(err));
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
            res.body.Items.should.have.lengthOf(91);
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
            res.body.Items.should.have.lengthOf(91);
            resolve();
          })
          .catch(err => reject(err));
      });
    });
  });

  describe('/DELETE listing', () => {
    it('should delete one listing by primary key', () => {
      return new Promise((resolve, reject) => {
        chai.request(app)
          .delete('/listings/destroy')
          .set('authtoken', process.env.TEST_TOKEN_2)
          .send({
            listingId: 'c6426374584#12345679123456',
            listingDate: '2017-12-15 11:18',
          })
          .then((res) => {
            res.should.have.status(204);
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
