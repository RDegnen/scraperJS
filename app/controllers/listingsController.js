const Listing = require('../models/listing');

const all_listings = (req, res) => {
  res.send('Not implemented');
};

const provider_listings = (req, res) => {
  res.send('Not implemented: Provider ' + req.params);
};

module.exports = {
  all_listings,
  provider_listings
}
