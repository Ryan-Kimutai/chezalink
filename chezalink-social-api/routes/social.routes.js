const express = require('express');
const router = express.Router();
const socialController = require('../controllers/social.controller');
const verifyToken = require('../../chezalink-auth-api/middleware/verifyToken'); 

// 🔒 Protected routes (require JWT token)
router.post('/follow/:targetUser', verifyToken, socialController.followUser);
router.delete('/unfollow/:targetUser', verifyToken, socialController.unfollowUser);

// 🌐 Public routes (no token needed)
router.get('/followers/:user_name', socialController.getFollowers);   // user_name is the one whose followers you want
router.get('/following/:user_name', socialController.getFollowing);   // user_name is the one whose following list you want
router.get('/profile/:user_name', socialController.getProfile);

module.exports = router;
