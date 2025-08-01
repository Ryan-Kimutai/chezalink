const verifyToken = require('../../chezalink-auth-api/middleware/verifyToken'); // ✅ corrected path

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/userprofile.controllers');

router.post('/', verifyToken, profileController.createProfile);
router.get('/me', verifyToken, profileController.getMyProfile);
router.put('/me', verifyToken, profileController.updateProfile);

module.exports = router;

