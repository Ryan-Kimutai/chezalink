const db = require('../db');

exports.followUser = (followerId, followingId) => {
  const query = `
    INSERT INTO follows (follower_id, following_id)
    VALUES ($1, $2)
    RETURNING *;
  `;
  return db.query(query, [followerId, followingId]).then(res => res.rows[0]);
};

exports.unfollowUser = (followerId, followingId) => {
  const query = `
    DELETE FROM follows
    WHERE follower_id = $1 AND following_id = $2;
  `;
  return db.query(query, [followerId, followingId]);
};

exports.getFollowers = (userId) => {
  const query = `
    SELECT u.id, u.email, u.role
    FROM follows f
    JOIN users u ON f.follower_id = u.id
    WHERE f.following_id = $1;
  `;
  return db.query(query, [userId]).then(res => res.rows);
};

exports.getFollowing = (userId) => {
  const query = `
    SELECT u.id, u.email, u.role
    FROM follows f
    JOIN users u ON f.following_id = u.id
    WHERE f.follower_id = $1;
  `;
  return db.query(query, [userId]).then(res => res.rows);
};
