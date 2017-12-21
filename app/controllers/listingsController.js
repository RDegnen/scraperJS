const Listing = require('../models/listing');
const Scraper = require('../models/scraper')

const index = (req, res, next) => {
  Listing.getAllListings()
    .then(listings => res.json(listings))
    .catch(err => next(err));
};

const show = (req, res, next) => {
  Listing.getListing(req)
    .then(listing => res.json(listing))
    .catch(err => next(err));
};

const create = (req, res, next) => {
  Scraper.getHtml()
    .then(data => Scraper.scrapeCraigslist(data))
    .then(data => Scraper.writeListings(data))
    .then(resp => res.json(resp))
    .catch(err => next(err));
};

module.exports = {
  index,
  show,
  create,
};
