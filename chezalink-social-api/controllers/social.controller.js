const service = require('./social.service');

exports.followUser = async (req, res) => {
  const followerId = req.user.id;
  const followingId = req.params.targetId;

  if (followerId === followingId) {
    return res.status(400).json({ error: "You can't follow yourself." });
  }

  try {
    const result = await service.followUser(followerId, followingId);
    res.status(201).json({ message: 'Followed successfully.', data: result });
  } catch (err) {
    if (err.code === '23505') { // duplicate follow
      return res.status(400).json({ error: 'Already following this user.' });
    }
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.unfollowUser = async (req, res) => {
  const followerId = req.user.id;
  const followingId = req.params.targetId;

  try {
    const result = await service.unfollowUser(followerId, followingId);
    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'Not following this user.' });
    }
    res.status(200).json({ message: 'Unfollowed successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.getFollowers = async (req, res) => {
  const userId = req.params.userId;
  try {
    const followers = await service.getFollowers(userId);
    res.json(followers);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.getFollowing = async (req, res) => {
  const userId = req.params.userId;
  try {
    const following = await service.getFollowing(userId);
    res.json(following);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};
