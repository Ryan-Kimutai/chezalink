const express = require('express');
const router = express.Router();

// Import the middleware to verify JWT
const verifyToken = require('../middleware/verifyToken');

// A simple protected route
router.get('/dashboard', verifyToken, (req, res) => {
  // If the token was valid, user info will be in req.user
  res.json({ message: `Welcome, ${req.user.username}` });
});

module.exports = router;
