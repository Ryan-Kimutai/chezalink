const db = require('../db');

exports.followUser = (followerUser, followedUser) => {
  const query = `
    INSERT INTO followers (follower_user, followed_user)
    VALUES ($1, $2)
    RETURNING *;
  `;
  return db.query(query, [followerUser, followedUser]).then(res => res.rows[0]);
};

exports.unfollowUser = (followerUser, followedUser) => {
  const query = `
    DELETE FROM followers
    WHERE follower_user = $1 AND followed_user = $2;
  `;
  return db.query(query, [followerUser, followedUser]);
};

// Get followers of a given user
exports.getFollowers = (user_name) => {
  const query = `
    SELECT 
      a.user_name
    FROM followers f
    JOIN accounts a ON f.follower_user = a.user_name
    WHERE f.followed_user = $1;
  `;
  return db.query(query, [user_name]).then(res => res.rows);
};

// Get accounts a user is following
exports.getFollowing = (user_name) => {
  const query = `
    SELECT 
      a.user_name
    FROM followers f
    JOIN accounts a ON f.followed_user = a.user_name
    WHERE f.follower_user = $1;
  `;
  return db.query(query, [user_name]).then(res => res.rows);
};


exports.getUserProfileByUsername = async (user_name) => {
  try {
    // Step 1: Get account type from main profile table
    const accountTypeResult = await pool.query(
      'SELECT account_type FROM profile WHERE user_name = $1',
      [user_name]
    );

    if (accountTypeResult.rowCount === 0) {
      return null; // Not found
    }

    const accountType = accountTypeResult.rows[0].account_type;

    // Step 2: Query the relevant table
    let profileResult;
    switch (accountType) {
      case 'player':
        profileResult = await pool.query(
          'SELECT * FROM player_profile WHERE user_name = $1',
          [user_name]
        );
        break;
      case 'scout':
        profileResult = await pool.query(
          'SELECT * FROM scout_profile WHERE user_name = $1',
          [user_name]
        );
        break;
      case 'institution':
        profileResult = await pool.query(
          'SELECT * FROM institutions_profile WHERE user_name = $1',
          [user_name]
        );
        break;
      default:
        return null;
    }

    return profileResult.rows[0] || null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};