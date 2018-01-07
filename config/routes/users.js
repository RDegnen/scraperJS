const express = require('express');
const router = express.Router();
const userController = require('../../app/controllers/userController');

router.get('/login', userController.login);
router.get('/auth', userController.githubAuth);
router.get('/logout', userController.logout);

module.exports = router;
