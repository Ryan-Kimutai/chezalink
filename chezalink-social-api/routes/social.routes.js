const express = require('express');
const router = express.Router();
const controller = require('./social.controller');
const verifyToken = require('../auth module/middleware/verifyToken');

router.post('/follow/:targetId', verifyToken, controller.followUser);
router.delete('/unfollow/:targetId', verifyToken, controller.unfollowUser);
router.get('/followers/:userId', controller.getFollowers);
router.get('/following/:userId', controller.getFollowing);

module.exports = router;
