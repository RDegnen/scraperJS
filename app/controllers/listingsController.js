const Listing = require('../models/listing');

const allListings = (req, res) => {
  res.send('Not implemented');
};

const providerListings = (req, res) => {
  res.send('Not implemented: Provider ' + req.params);
};

module.exports = {
  allListings,
  providerListings,
};
