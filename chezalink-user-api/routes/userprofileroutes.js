const express = require('express');
const router = express.Router();
const verifyToken = require('./middleware/verifyToken'); 

const {
  createProfile,          // Handles both base and type-specific data together
  getProfile,
  updateProfile,
} = require('../controllers/userprofile.controllers');

// Route to create full profile (base + type-specific)
router.post('/profile',verifyToken, createProfile);

// Route to get profile by username
router.get('/profile/:user_name',verifyToken, getProfile);

// Route to update profile
router.put('/profile/:user_name', verifyToken,updateProfile);

module.exports = router;

