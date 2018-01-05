const express = require('express');
const router = express.Router();
const loginController = require('../../app/controllers/loginController');

router.get('/', loginController.githubAuth);

module.exports = router;
