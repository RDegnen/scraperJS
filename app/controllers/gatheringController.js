const Gatherer = require('../models/gatherer');

const create = (req, res, next) => {
  const { body: originalBody } = req;
  Gatherer.collectCraigslistHtml(req)
    .then(data => Gatherer.writePageToDynamo(data, req.body))
    .then((resp) => {
      console.log(originalBody)
    })
    // .then(resp => Gatherer.collectIndeedHtml({ body: originalBody }))
    // .then(data => Gatherer.writePageToDynamo(data, originalBody))
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
