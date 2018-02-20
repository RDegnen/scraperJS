const express = require('express');
const router = express.Router();
const listingsController = require('../../app/controllers/listingsController');
const routeMiddleware = require('./middleware/routesMiddleware');
// Note from https://stackoverflow.com/questions/32603818/order-of-router-precedence-in-express-js
// if I do get /user after get /:source for instance, /:source will serve for /user.
// doing /get/user fixed that.
router.get('/:source', routeMiddleware.authenticate, listingsController.index);
router.get('/:id', routeMiddleware.authenticate, listingsController.show);
router.get('/get/user', routeMiddleware.authenticate, listingsController.userIndex);
router.post('/create/:source', routeMiddleware.authenticate, listingsController.create);
router.delete('/destroy', routeMiddleware.authenticate, listingsController.destroy);
router.delete('/destroy/bulk', routeMiddleware.authenticate, listingsController.destroyBulk);

module.exports = router;
