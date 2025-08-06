const express = require('express');         // Import Express
const router = express.Router();            // Create router

// Import controller functions
const {
  getStats,
  createStat
} = require('../controllers/statsController');

// Get all stats or stats by user (via query)
router.get('/', getStats);

// Create a new stat
router.post('/', createStat);

module.exports = router;                    // Export the router
