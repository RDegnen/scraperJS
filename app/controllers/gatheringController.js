const Gatherer = require('../models/gatherer');

const create = (req, res, next) => {
  Gatherer.collectHtml(req)
    .then(results => Gatherer.writePageToDynamo(results, req.body.source))
    .then(resp => res.json(resp))
    .catch(err => next(err));
};

module.exports = {
  create,
};
