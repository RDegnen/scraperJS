const express = require('express');
const router = express.Router();
const gatheringController = require('../../app/controllers/gatheringController');

router.post('/', gatheringController.create);

module.exports = router;
