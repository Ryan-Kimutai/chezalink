// routes/auth.routes.js

const express = require('express');
const router = express.Router();

// Import controller functions
const { signup, login } = require('../controllers/auth.controller');

// Define routes
router.post('/signup', signup); // when POST /signup is called, run signup controller
router.post('/login', login);   // when POST /login is called, run login controller

module.exports = router;
// Export the router to use in server.js