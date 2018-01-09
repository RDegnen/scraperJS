const express = require('express');
const router = express.Router();
const listingsController = require('../../app/controllers/listingsController');
const routeMiddleware = require('./middleware/routesMiddleware');

router.get('/:source', routeMiddleware.authenticate, listingsController.index);
router.get('/:id', routeMiddleware.authenticate, listingsController.show);
router.post('/create/:source', routeMiddleware.authenticate, listingsController.create);
router.delete('/destroy/:source', routeMiddleware.authenticate, listingsController.destroy);

module.exports = router;
