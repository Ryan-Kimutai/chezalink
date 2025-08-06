const { v4: uuidv4 } = require('uuid');

// Mock database (in-memory)
let tournaments = [];
let matches = [];
let playerStats = {}; // Key: playerId-tournamentId => stats
let teamStats = {};   // Key: teamId-tournamentId => stats

// Helper: Generate knockout bracket
function generateKnockoutBracketFromTeams(teams){
  let shuffled = [...teams].sort(() => 0.5 - Math.random());
  let bracket = [];
  for (let i = 0; i < shuffled.length; i += 2) {
    bracket.push({
      matchId: uuidv4(),
      teamA: shuffled[i],
      teamB: shuffled[i + 1] || null,
      winner: null,
      stage: 1
    });
  }
  return bracket;
}

// Helper: Generate group tables based on specified number of groups
function generateGroups(teams, numGroups) {
  const shuffled = [...teams].sort(() => 0.5 - Math.random());
  const groupSize = Math.floor(teams.length / numGroups);
  const groups = [];

  for (let i = 0; i < numGroups; i++) {
    const start = i * groupSize;
    const end = start + groupSize;
    const groupTeams = shuffled.slice(start, end);
    groups.push({
      groupId: `Group ${String.fromCharCode(65 + i)}`,
      teams: groupTeams,
      standings: groupTeams.map(teamId => ({
        teamId,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
      }))
    });
  }

  return groups;
}

// Create a new tournament
const createTournament = (req, res) => {
  const {
    hostTeamId,
    name,
    type,
    ageBrackets,
    teams,
    playersPerTeam,
    numberOfGroups // Only needed for group-knockout
  } = req.body;

  if (!hostTeamId || !name || !type || !ageBrackets || !teams || teams.length < 2) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newTournament = {
    id: uuidv4(),
    hostTeamId,
    name,
    type,
    ageBrackets,
    teams,
    playersPerTeam,
    createdAt: new Date().toISOString(),
    status: 'upcoming',
    mvp: null,
    bracket: [],
    groupTables: [],
    standings: [],
    playerStats: []
  };

  // Structure setup
  if (type === 'knockout') {
    newTournament.bracket = generateKnockoutBracketFromTeams(teams);
  } else if (type === 'group-knockout') {
    if (!numberOfGroups || teams.length % numberOfGroups !== 0) {
      return res.status(400).json({
        error: 'Please provide a valid numberOfGroups such that all groups have equal number of teams'
      });
    }
    newTournament.groupTables = generateGroups(teams, numberOfGroups);
  } else if (type === 'league') {
    newTournament.standings = teams.map(teamId => ({
      teamId,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goaldifference: 0,
      goaldifference: 0,
      points: 0
    }));
  }

  tournaments.push(newTournament);
  res.status(201).json(newTournament);
};

// Register a team to a tournament
const registerTeamToTournament = (req, res) => {
  const { id } = req.params;
  const { teamId } = req.body;

  const tournament = tournaments.find(t => t.id === id);
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

  if (!tournament.teams.includes(teamId)) {
    tournament.teams.push(teamId);
    return res.json({ message: 'Team registered successfully', tournament });
  }

  res.status(400).json({ error: 'Team already registered' });
};

// Record a match
const recordMatch = (req, res) => {
  const {
    tournamentId,
    teamAId,
    teamBId,
    scoreA,
    scoreB,
    manOfTheMatchId,
    playerPerformances // Array of { playerId, goals, assists, cards, cleanSheet }
  } = req.body;

  const tournament = tournaments.find(t => t.id === tournamentId);
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

  const match = {
    id: uuidv4(),
    tournamentId,
    teamAId,
    teamBId,
    scoreA,
    scoreB,
    manOfTheMatchId,
    playerPerformances,
    playedAt: new Date().toISOString()
  };

  matches.push(match);

  // Update team stats
  const updateTeamStats = (teamId, goalsFor, goalsAgainst, result) => {
    const key = `${teamId}-${tournamentId}`;
    if (!teamStats[key]) {
      teamStats[key] = {
        teamId,
        tournamentId,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
      };
    }

    const stats = teamStats[key];
    stats.played += 1;
    stats.goalsFor += goalsFor;
    stats.goalsAgainst += goalsAgainst;
    stats.goaldifference = stats.goalsFor - stats.goalsAgainst;

    if (result === 'win') {
      stats.won += 1;
      stats.points += 3;
    } else if (result === 'draw') {
      stats.drawn += 1;
      stats.points += 1;
    } else {
      stats.lost += 1;
    }
  };

  if (scoreA > scoreB) {
    updateTeamStats(teamAId, scoreA, scoreB, 'win');
    updateTeamStats(teamBId, scoreB, scoreA, 'loss');
  } else if (scoreB > scoreA) {
    updateTeamStats(teamAId, scoreA, scoreB, 'loss');
    updateTeamStats(teamBId, scoreB, scoreA, 'win');
  } else {
    updateTeamStats(teamAId, scoreA, scoreB, 'draw');
    updateTeamStats(teamBId, scoreB, scoreA, 'draw');
  }

  // Update player stats
  playerPerformances.forEach(perf => {
    const key = `${perf.playerId}-${tournamentId}`;
    if (!playerStats[key]) {
      playerStats[key] = {
        playerId: perf.playerId,
        tournamentId,
        goals: 0,
        assists: 0,
        cards: 0,
        cleanSheets: 0,
        manOfTheMatch: 0,
        matchesPlayed: 0
      };
    }

    const stats = playerStats[key];
    stats.goals += perf.goals || 0;
    stats.assists += perf.assists || 0;
    stats.cards += perf.cards || 0;
    stats.cleanSheets += perf.cleanSheet ? 1 : 0;
    stats.matchesPlayed += 1;

    if (perf.playerId === manOfTheMatchId) {
      stats.manOfTheMatch += 1;
    }
  });

  res.status(201).json({ message: 'Match recorded successfully', match });
};

// Set MVP of a tournament
const setTournamentMVP = (req, res) => {
  const { id } = req.params;
  const { playerId } = req.body;

  const tournament = tournaments.find(t => t.id === id);
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

  tournament.mvp = playerId;
  res.json({ message: 'MVP set successfully', tournament });
};

// Get full tournament stats
const getTournamentStats = (req, res) => {
  const { id } = req.params;

  const tournament = tournaments.find(t => t.id === id);
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

  const relatedMatches = matches.filter(m => m.tournamentId === id);
  const relatedPlayerStats = Object.values(playerStats).filter(ps => ps.tournamentId === id);
  const relatedTeamStats = Object.values(teamStats).filter(ts => ts.tournamentId === id);

  res.json({
    tournament,
    matches: relatedMatches,
    playerStats: relatedPlayerStats,
    teamStats: relatedTeamStats
  });
};

// Manually generate knockout bracket for group-knockout tournaments
const generateKnockoutBracket = (req, res) => {
  const { id } = req.params;
  const tournament = tournaments.find(t => t.id === id);
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

  if (tournament.type !== 'group-knockout') {
    return res.status(400).json({ error: 'This tournament is not group-knockout type' });
  }

  // For now just shuffle top team from each group
  const topTeams = tournament.groupTables.map(g => g.standings[0].teamId);
  tournament.bracket = generateKnockoutBracketFromTeams(topTeams);
  res.json({ message: 'Knockout bracket generated', bracket: tournament.bracket });
};

// Manually generate groups for group-knockout tournaments
const generateGroupsManually = (req, res) => {
    const { id } = req.params;
    const { numberOfGroups } = req.body;
  
    const tournament = tournaments.find(t => t.id === id);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
  
    if (tournament.type !== 'group-knockout') {
      return res.status(400).json({ error: 'This tournament is not group-knockout type' });
    }
  
    const totalTeams = tournament.teams.length;
    if (!numberOfGroups || totalTeams % numberOfGroups !== 0) {
      return res.status(400).json({
        error: 'Invalid numberOfGroups. Must divide total number of teams equally.'
      });
    }
  
    tournament.groupTables = generateGroups(tournament.teams, numberOfGroups);
    res.json({ message: 'Groups generated successfully', groupTables: tournament.groupTables });
  };

// Advance to next knockout stage
const advanceKnockoutStage = (req, res) => {
  const { id } = req.params;
  const tournament = tournaments.find(t => t.id === id);
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

  const lastStage = Math.max(...tournament.bracket.map(m => m.stage));
  const completedMatches = tournament.bracket.filter(m => m.stage === lastStage && m.winner);
  if (completedMatches.length * 2 !== tournament.bracket.filter(m => m.stage === lastStage).length) {
    return res.status(400).json({ error: 'All matches in the current stage must be completed' });
  }

  const nextStageTeams = completedMatches.map(m => m.winner);
  const nextStage = lastStage + 1;
  const nextStageMatches = [];

  for (let i = 0; i < nextStageTeams.length; i += 2) {
    nextStageMatches.push({
      matchId: uuidv4(),
      teamA: nextStageTeams[i],
      teamB: nextStageTeams[i + 1] || null,
      winner: null,
      stage: nextStage
    });
  }

  tournament.bracket.push(...nextStageMatches);
  res.json({ message: 'Advanced to next knockout stage', bracket: tournament.bracket });
};

// Tournament Feed: categorize tournaments by status
const getTournamentFeed = (req, res) => {
  const now = new Date();
  const registration_open = [];
  const ongoing = [];
  const ended = [];

  for (let t of tournaments) {
    const start = new Date(t.createdAt); // You can add a separate startDate if needed
    const hasMatches = matches.some(m => m.tournamentId === t.id);
    const isConcluded = t.bracket?.every(m => m.winner !== null);

    // Check for status manually since status is not updated dynamically
    if (!hasMatches && t.status === 'upcoming') {
      registration_open.push({ ...t, feedStatus: 'registration_open' });
    } else if (hasMatches && !isConcluded) {
      ongoing.push({ ...t, feedStatus: 'ongoing' });
    } else if (isConcluded) {
      ended.push({ ...t, feedStatus: 'ended' });
    }
  }

  res.status(200).json({ registration_open, ongoing, ended });
};

module.exports = {
  createTournament,
  registerTeamToTournament,
  recordMatch,
  setTournamentMVP,
  getTournamentStats,
  generateKnockoutBracket,
  advanceKnockoutStage,
  generateGroupsManually,
  getTournamentFeed 
};

