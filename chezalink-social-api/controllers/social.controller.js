const service = require('../services/social.service');

// Follow another user
exports.followUser = async (req, res) => {
  const followerUser = req.user.user_name;
  const followedUser = req.params.targetUser;

  if (followerUser === followedUser) {
    return res.status(400).json({ error: "You can't follow yourself." });
  }

  try {
    const result = await service.followUser(followerUser, followedUser);
    res.status(201).json({ message: 'Followed successfully.', data: result });
  } catch (err) {
    console.error('Follow error:', err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Already following this user.' });
    }
    res.status(500).json({ error: 'Server error.' });
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  const followerUser = req.user.user_name;
  const followedUser = req.params.targetUser;

  try {
    const result = await service.unfollowUser(followerUser, followedUser);
    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'Not following this user.' });
    }
    res.status(200).json({ message: 'Unfollowed successfully.' });
  } catch (err) {
    console.error('Unfollow error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// Get followers of a user
exports.getFollowers = async (req, res) => {
  const user_name = req.params.user_name;

  try {
    const followers = await service.getFollowers(user_name);
    res.status(200).json(followers);
  } catch (err) {
    console.error('Get followers error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// Get users followed by a user
exports.getFollowing = async (req, res) => {
  const user_name = req.params.user_name;

  try {
    const following = await service.getFollowing(user_name);
    res.status(200).json(following);
  } catch (err) {
    console.error('Get following error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// Controller to get a user profile by username
// controllers/userprofile.controllers.js
const { getUserProfileByUsername } = require('../services/userprofile.services');

exports.getProfile = async (req, res) => {
  try {
    const { user_name } = req.params;
    const profile = await getUserProfileByUsername(user_name);

    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error in getProfile controller:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

