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

exports.getFollowers = (user_name) => {
  const query = `
    SELECT a.user_name, a.email
    FROM followers f
    JOIN accounts a ON f.follower_user = a.user_name
    WHERE f.followed_user = $1;
  `;
  return db.query(query, [user_name]).then(res => res.rows);
};

exports.getFollowing = (user_name) => {
  const query = `
    SELECT a.user_name, a.email
    FROM followers f
    JOIN accounts a ON f.followed_user = a.user_name
    WHERE f.follower_user = $1;
  `;
  return db.query(query, [user_name]).then(res => res.rows);
};
exports.getUserProfile = (user_name) => {
  const query = `
    SELECT p.first_name, p.last_name, p.bio, p.county, p.date_of_birth, p.account_type, p.prefered_foot, p.position
    FROM profile p
    WHERE p.user_name = $1;
  `;
  return db.query(query, [user_name]).then(res => res.rows[0]);
};