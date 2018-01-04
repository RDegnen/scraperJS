const express = require('express');
const router = express.Router();
const listingsController = require('../../app/controllers/listingsController');

router.get('/:source', listingsController.index);
router.get('/:id', listingsController.show);
router.post('/create/:source', listingsController.create);
router.delete('/destroy/:source', listingsController.destroy);

module.exports = router;
