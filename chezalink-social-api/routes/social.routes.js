const express = require('express');
const router = express.Router();
const socialController = require('../controllers/social.controller'); // ✅ Use this name

// Removed verifyToken middleware for MVP testing

router.post('/follow/:targetId', socialController.followUser);
router.delete('/unfollow/:targetId', socialController.unfollowUser);
router.get('/followers/:userId', socialController.getFollowers);
router.get('/following/:userId', socialController.getFollowing);

module.exports = router;
