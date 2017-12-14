const express = require('express');
const router = express.Router();
const listingsController = require('../../app/controllers/listingsController');

router.get('/', listingsController.allListings);

module.exports = router;
