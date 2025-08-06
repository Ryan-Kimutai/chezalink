
// Simulating a database with a simple array
let statsDB = [];
let currentId = 1;

/*
 Create a new stat record
  POST /api/stats
 */
exports.createStat = (req, res) => {
  const {
    user_id,
    tournament_id,
    season_id,
    matches_played,
    goals,
    assists,
    clean_sheets
  } = req.body;

  // Basic validation
  if (!user_id || !season_id) {
    return res.status(400).json({ message: "user_id and season_id are required." });
  }

  const newStat = {
    id: currentId++,                        // Auto-incremented stat ID
    user_id,
    tournament_id: tournament_id || null,  // Optional tournament
    season_id,
    matches_played: matches_played || 0,
    goals: goals || 0,
    assists: assists || 0,
    clean_sheets: clean_sheets || 0,
    created_at: new Date()
  };

  statsDB.push(newStat); // Save in "fake" DB
  res.status(201).json(newStat); // Send back the created stat
};


/* 
 Get all stats or filter by user_id
 GET /api/stats or /api/stats?user_id=123
 */
exports.getStats = (req, res) => {
  const { user_id } = req.query;

  if (user_id) {
    // Filter only stats for this user
    const userStats = statsDB.filter(stat => stat.user_id === user_id);
    return res.json(userStats);
  }

  // Return all stats
  res.json(statsDB);
};
