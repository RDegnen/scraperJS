process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const sinon = require('sinon');
const Gatherer = require('../app/models/gatherer');
const gatheringController = require('../app/controllers/gatheringController');

const should = chai.should();

chai.use(chaiHttp);

describe('Gathering HTML', () => {
  const fakeReq = {
    body: {
      source: 'all',
      location: 'new york',
      terms: ['front end'],
      pages: 0,
    },
  };
  const fakeRes = {};
  const fakeNext = () => {
    return 'Fake Error';
  };

  describe('Gathering all', () => {
    it('should call gathering functions for all sites', () => {
      const collectCraigslistHtml = sinon.stub(Gatherer, 'collectCraigslistHtml');
      const collectIndeedHtml = sinon.stub(Gatherer, 'collectIndeedHtml');
      gatheringController.create(fakeReq, fakeRes, fakeNext);

      collectCraigslistHtml.restore();
      collectIndeedHtml.restore();

      sinon.assert.calledWith(collectCraigslistHtml, fakeReq);
      sinon.assert.calledWith(collectIndeedHtml, fakeReq);
    });
  });
});
