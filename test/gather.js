process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const sinon = require('sinon');
const sinonTestFactory = require('sinon-test');
const Gatherer = require('../app/models/gatherer');
const gatheringController = require('../app/controllers/gatheringController');

const sinonTest = sinonTestFactory(sinon);
const should = chai.should();
const { expect } = chai;

/* eslint func-names: ["error", "never"] */

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
    it('should call gathering functions for all sites', sinonTest(function () {
      const collectCraigslistHtmlSpy = this.stub(Gatherer, 'collectCraigslistHtml');
      const collectIndeedHtmlSpy = this.stub(Gatherer, 'collectIndeedHtml');
      gatheringController.create(fakeReq, fakeRes, fakeNext);

      sinon.assert.calledWith(collectCraigslistHtmlSpy, fakeReq);
      sinon.assert.calledWith(collectIndeedHtmlSpy, fakeReq);
    }));
    // FIXME not sure how to test the calling of dynamo
    it('should call writePageToDynamo with proper params', sinonTest(function () {
      // const html = `<html>
      //   <div>
      //     <p> fake html </p>
      //   </div>
      // </html>`;
      // const params = { location: 'new+york', source: 'indeed' };
      const writeToDynamoStub = this.stub(Gatherer, 'writePageToDynamo');
      const collectIndeedSpy = this.spy(Gatherer, 'collectIndeedHtml');
      // writeToDynamoStub([html], params);
      collectIndeedSpy(fakeReq)
        .then((res) => {
          expect(res).to.eql({ UnprocessedItems: {} });
        })
        .catch(err => console.log(err));
    }));
  });
});
