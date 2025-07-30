const express = require('express');
const router = express.Router();

// Import controller functions
const { signup, login, getAllUsers } = require('../controllers/auth.controller');

// Routes
router.get('/users', getAllUsers);     // Get all users (testing only)
router.post('/signup', signup);        // Register a new user
router.post('/login', login);          // Log in a user

module.exports = router;
