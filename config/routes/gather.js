const express = require('express');
const router = express.Router();
const gatheringController = require('../../app/controllers/gatheringController');

router.post('/', gatheringController.create);
router.delete('/destroy/:source', gatheringController.destroy);

module.exports = router;
