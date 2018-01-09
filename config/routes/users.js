const express = require('express');
const router = express.Router();
const userController = require('../../app/controllers/userController');
const routeMiddleware = require('./middleware/routesMiddleware');

router.get('/login', userController.login);
router.get('/auth', userController.githubAuth);
router.get('/logout', routeMiddleware.authenticate, userController.logout);

module.exports = router;
