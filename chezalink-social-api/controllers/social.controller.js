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
  const user_name = req.params.targetUser;

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
  const user_name = req.params.targetUser;

  try {
    const following = await service.getFollowing(user_name);
    res.status(200).json(following);
  } catch (err) {
    console.error('Get following error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// Get profile for a user
exports.getUserProfile = async (req, res) => {
  const user_name = req.params.user_name;

  try {
    const profile = await service.getUserProfile(user_name);
    if (!profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    res.status(200).json(profile);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

