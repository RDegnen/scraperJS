const Gatherer = require('../models/gatherer');

const create = (req, res, next) => {
  Promise.all([Gatherer.collectCraigslistHtml(req), Gatherer.collectIndeedHtml(req)])
    .then(resp => res.status(200).json(resp))
    .catch(err => next(err));
};

const destroy = (req, res, next) => {
  Gatherer.getScrapedPages(req)
    .then(data => Gatherer.deleteScrapedPages(data))
    .then(resp => res.status(200).json(resp))
    .catch(err => next(err));
};

module.exports = {
  create,
  destroy,
};
