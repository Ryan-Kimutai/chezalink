// userprofile module/profile.routes.js
const express = require('express');
const router = express.Router();
const profileController = require('./profile.controller');
const { verifyToken } = require('../auth module/middleware/auth');

router.post('/', verifyToken, profileController.createProfile);
router.get('/me', verifyToken, profileController.getMyProfile);
router.put('/', verifyToken, profileController.updateProfile);

module.exports = router;
