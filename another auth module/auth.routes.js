const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { verifyToken } = require('./auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
