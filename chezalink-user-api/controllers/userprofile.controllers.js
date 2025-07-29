// userprofile module/profile.controller.js
const profileService = require('./profile.service');

exports.createProfile = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const profile = await profileService.createProfile(userId, role, req.body);
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const profile = await profileService.getProfileByUserId(userId);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const updated = await profileService.updateProfile(userId, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
