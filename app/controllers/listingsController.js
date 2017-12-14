const Listing = require('../models/listing');

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

module.exports = {
  index,
  show,
};
