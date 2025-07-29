// userprofile module/profile.service.js
const pool = require('../db');

exports.createProfile = async (userId, role, data) => {
  const {
    full_name, bio, avatar_url,
    position, age, height, weight, dominant_foot,
    organization, region,
    institution_name, location, contact_email,
  } = data;

  const result = await pool.query(
    `INSERT INTO user_profiles (
      user_id, role, full_name, bio, avatar_url,
      position, age, height, weight, dominant_foot,
      organization, region,
      institution_name, location, contact_email
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10,
      $11, $12,
      $13, $14, $15
    ) RETURNING *`,
    [
      userId, role, full_name, bio, avatar_url,
      position, age, height, weight, dominant_foot,
      organization, region,
      institution_name, location, contact_email
    ]
  );

  return result.rows[0];
};

exports.getProfileByUserId = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM user_profiles WHERE user_id = $1',
    [userId]
  );
  return result.rows[0];
};

exports.updateProfile = async (userId, data) => {
  const fields = Object.keys(data);
  const values = Object.values(data);

  const updates = fields.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const result = await pool.query(
    `UPDATE user_profiles SET ${updates}, updated_at = CURRENT_TIMESTAMP WHERE user_id = $${fields.length + 1} RETURNING *`,
    [...values, userId]
  );

  return result.rows[0];
};
