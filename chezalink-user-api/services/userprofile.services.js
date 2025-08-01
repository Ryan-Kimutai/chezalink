const db = require('../db');

// Create a user profile
exports.createProfile = async (user_name, data) => {
  const {
    user_name: _user_name, // This should be the same as the user_name from JWT
    first_name,
    last_name,
    bio,
    county,
    date_of_birth,
    account_type,
    prefered_foot,
    position
  } = data;

  const query = `
    INSERT INTO profile (
      user_name,
      first_name,
      last_name,
      bio,
      county,
      date_of_birth,
      account_type,
      prefered_foot,
      position
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;

  const values = [
    user_name, // This should match the user_name from JWT
    first_name,
    last_name,
    bio,
    county,
    date_of_birth,
    account_type,
    prefered_foot,
    position
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};


// Get a profile by user_name
exports.getProfileByUserName = async (user_name) => {
  const result = await db.query('SELECT * FROM profile WHERE user_name = $1', [user_name]);
  return result.rows[0];
};

// Update profile
exports.updateProfile = async (user_name, data) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const key in data) {
    fields.push(`${key} = $${index}`);
    values.push(data[key]);
    index++;
  }

  values.push(user_name);

  const query = `
    UPDATE profile
    SET ${fields.join(', ')}
    WHERE user_name = $${index}
    RETURNING *;
  `;

  const result = await db.query(query, values);
  return result.rows[0];
};
