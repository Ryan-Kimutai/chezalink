const express = require('express');
const router = express.Router();

const {
  createTournament,
  recordMatch,
  getTournamentStats,
  setTournamentMVP,
  generateKnockoutBracket,
  registerTeamToTournament,
  advanceKnockoutStage,
  generateGroupsManually
} = require('../controllers/tournamentController');

// Create a tournament
router.post('/tournaments', createTournament);

// Register a team to a tournament
router.post('/tournaments/:id/register', registerTeamToTournament);

// Record a match
router.post('/matches', recordMatch);

// Get tournament stats
router.get('/tournaments/:id', getTournamentStats);

// Set tournament MVP
router.post('/tournaments/:id/mvp', setTournamentMVP);

// Generate knockout bracket manually
router.post('/tournaments/:id/generate-knockout', generateKnockoutBracket);

// Advance to next knockout stage
router.post('/tournaments/:id/advance', advanceKnockoutStage);

// Generate groups manually (for group-knockout tournaments)
router.post('/tournaments/:id/generate-groups', generateGroupsManually);

module.exports = router;

