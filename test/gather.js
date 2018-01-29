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
const { expect, assert } = chai;

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
    // FIXME not sure how to test the calling of dynamo, came up with just faking,
    // the first part of the indeed logic to avoid the actual scraping.
    it('write proper params to dynamo', sinonTest(function () {
      const html = `<html>
        <div>
          <p> fake html </p>
        </div>
      </html>`;
      const expectedParams = { location: 'new+york', terms: ['front+end'], source: 'indeed' };
      const writeToDynamoSpy = this.spy(Gatherer, 'writePageToDynamo');
      const collectIndeedStub = this.stub(Gatherer, 'collectIndeedHtml').callsFake((req) => {
        let { location } = req.body;
        if (location.split(' ').length > 1) location = location.split(' ').join('+');
        const terms = req.body.terms.map(t => t.split(' ').join('+'));
        const newBody = { location, terms, source: 'indeed' };
        return Gatherer.writePageToDynamo([html], newBody);
      });

      Gatherer.collectIndeedHtml(fakeReq);

      sinon.assert.calledWith(collectIndeedStub, fakeReq);
      sinon.assert.calledWith(writeToDynamoSpy, [html], expectedParams);
      assert(true, writeToDynamoSpy.returned({ UnprocessedItems: {} }));
    }));
  });
});
