const express = require('express');
const router = express.Router();
const userController = require('../../app/controllers/userController');
const routeMiddleware = require('./middleware/routesMiddleware');

router.get('/login', userController.login);
router.post('/auth', userController.githubAuth);
router.post('/logout', routeMiddleware.authenticate, userController.logout);
router.get('/validate', routeMiddleware.authenticate, userController.validateAuth);

module.exports = router;
