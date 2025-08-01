const express = require('express');
const verifyToken = require('../../chezalink-auth-api/middleware/verifyToken'); // ✅ corrected path
const router = express.Router();
const profileController = require('../controllers/userprofile.controllers');

router.post('/profile', verifyToken, profileController.createProfile);
router.get('/me', verifyToken, profileController.getMyProfile);
router.put('/me', verifyToken, profileController.updateProfile);


module.exports = router;

