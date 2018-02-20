const Listing = require('../models/listing');
const Scraper = require('../models/scraper');
const Gatherer = require('../models/gatherer');

const index = (req, res, next) => {
  Listing.getMultipleListings(req)
    .then(listings => res.json(listings))
    .catch(err => next(err));
};

const show = (req, res, next) => {
  Listing.getListing(req)
    .then(listing => res.json(listing))
    .catch(err => next(err));
};

const userIndex = (req, res, next) => {
  Listing.getUserListings(req)
    .then(listings => res.json(listings))
    .catch(err => next(err));
};

const create = (req, res, next) => {
  Gatherer.fetchProxies()
    .then(proxy => Promise.all([Gatherer.collectCraigslistHtml(req, proxy),
      Gatherer.collectIndeedHtml(req, proxy)]))
    .then(data => Scraper.scrapeAll(req, data))
    .then(data => Scraper.writeListings(data))
    .then(resp => res.json(resp))
    .catch(err => next(err));
};

const destroy = (req, res, next) => {
  Listing.destroyListing(req)
    .then(resp => res.status(204).json(resp))
    .catch(err => next(err));
};

const destroyBulk = (req, res, next) => {
  Listing.getUserListings(req)
    .then(data => Listing.destroyListings(data))
    .then(resp => res.json(resp))
    .catch(err => next(err));
};

module.exports = {
  index,
  show,
  userIndex,
  create,
  destroy,
  destroyBulk,
};
