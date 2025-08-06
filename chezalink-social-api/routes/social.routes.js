const express = require('express');
const router = express.Router();
const socialController = require('../controllers/social.controller');
const verifyToken = require('../../chezalink-auth-api/middleware/verifyToken'); // ✅ Adjust path if needed

// 🔒 Protected routes (require JWT token)
router.post('/follow/:targetUser', verifyToken, socialController.followUser);
router.delete('/unfollow/:targetUser', verifyToken, socialController.unfollowUser);

// 🌐 Public routes (no token needed)
router.get('/followers/:user_name', socialController.getFollowers);
router.get('/following/:user_name', socialController.getFollowing);
router.get('/profile/:user_name', socialController.getUserProfile);

module.exports = router;


