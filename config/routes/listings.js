const express = require('express');
const router = express.Router();
const listingsController = require('../../app/controllers/listingsController')

router.get('/', listingsController.all_listings);

module.exports = router;
