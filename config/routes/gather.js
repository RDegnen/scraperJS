const express = require('express');
const router = express.Router();
const gatheringController = require('../../app/controllers/gatheringController');
const routeMiddleware = require('./middleware/routesMiddleware');

router.post('/', gatheringController.create);
router.delete('/destroy/:source', routeMiddleware.authenticate, gatheringController.destroy);

module.exports = router;
