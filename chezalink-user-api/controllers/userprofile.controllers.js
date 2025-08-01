const profileService = require('../services/userprofile.services');

exports.createProfile = async (req, res) => {
  try {
    const { user_name } = req.user; // <--- PROBLEM LIKELY HERE!
    const profile = await profileService.createProfile(user_name, req.body);
    res.status(201).json(profile);
  } catch (err) {
    console.error('Profile creation error:', err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const { user_name } = req.user;
    const profile = await profileService.getProfileByUserName(user_name);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { user_name } = req.user;
    const updated = await profileService.updateProfile(user_name, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
