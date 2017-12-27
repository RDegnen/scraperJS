const express = require('express');
const router = express.Router();
const listingsController = require('../../app/controllers/listingsController');

router.get('/', listingsController.index);
router.get('/:id', listingsController.show);
router.post('/create/:source', listingsController.create);
router.delete('/:source', listingsController.destroy);

module.exports = router;
