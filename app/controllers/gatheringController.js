const Gatherer = require('../models/gatherer');

const create = (req, res, next) => {
  Gatherer.collectHtml(req)
    .then(results => Gatherer.writePageToDynamo(results, req.body))
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
