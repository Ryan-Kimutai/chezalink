const db = require('../db');
const { mergeUpdateFields } = require('../utils/mergeUpdateFields');


// ---------------------- GET PROFILE ----------------------

const getUserProfileByUsername = async (user_name) => {
  const base = await db.query(
    `SELECT * FROM profile WHERE user_name = $1`,
    [user_name]
  );

  if (base.rows.length === 0) return null;

  const { account_type } = base.rows[0];

  let detail;
  if (account_type === 'player') {
    detail = await db.query(`SELECT * FROM player_profile WHERE user_name = $1`, [user_name]);
  } else if (account_type === 'scout') {
    detail = await db.query(`SELECT * FROM scout_profile WHERE user_name = $1`, [user_name]);
  } else if (account_type === 'institution') {
    detail = await db.query(`SELECT * FROM institutions_profile WHERE user_name = $1`, [user_name]);
  }

  return {
    account_type,
    ...detail.rows[0]
  };
};


// Base profile table
exports.createBaseProfile = async (user_name, account_type) => {
  const query = `
    INSERT INTO profile (user_name, account_type)
    VALUES ($1, $2)
  `;
  await db.query(query, [user_name, account_type]);
};

// ---------------------- PLAYER ----------------------

exports.createPlayerProfile = async (user_name, data) => {
  const {
    first_name, last_name, bio, county, date_of_birth,
    prefered_foot, position
  } = data;

  const query = `
    INSERT INTO player_profile (
      user_name, first_name, last_name, bio, county, date_of_birth, prefered_foot, position
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `;
  await db.query(query, [
    user_name, first_name, last_name, bio, county, date_of_birth, prefered_foot, position
  ]);
};

exports.updatePlayerProfile = async (user_name, updateData) => {
  const existing = await db.query(
    `SELECT * FROM player_profile WHERE user_name = $1`,
    [user_name]
  );
  if (existing.rows.length === 0) {
    throw new Error('Player profile not found');
  }

  const current = existing.rows[0];

  const merged = {
    first_name: updateData.first_name ?? current.first_name,
    last_name: updateData.last_name ?? current.last_name,
    bio: updateData.bio ?? current.bio,
    county: updateData.county ?? current.county,
    date_of_birth: updateData.date_of_birth ?? current.date_of_birth,
    prefered_foot: updateData.prefered_foot ?? current.prefered_foot,
    position: updateData.position ?? current.position,
  };

  const query = `
    UPDATE player_profile SET
      first_name = $1,
      last_name = $2,
      bio = $3,
      county = $4,
      date_of_birth = $5,
      prefered_foot = $6,
      position = $7
    WHERE user_name = $8
    RETURNING *;
  `;

  const values = [
    merged.first_name,
    merged.last_name,
    merged.bio,
    merged.county,
    merged.date_of_birth,
    merged.prefered_foot,
    merged.position,
    user_name,
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

// ---------------------- SCOUT ----------------------

exports.createScoutProfile = async (user_name, data) => {
  const {
    first_name, last_name, bio, county, date_of_birth,
    organization, experience_years, specialization
  } = data;

  const query = `
    INSERT INTO scout_profile (
      user_name, first_name, last_name, bio, county, date_of_birth, organization, experience_years, specialization
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `;
  await db.query(query, [
    user_name, first_name, last_name, bio, county, date_of_birth,
    organization, experience_years, specialization
  ]);
};

exports.updateScoutProfile = async function(user_name, updateData) {
  const existingProfile = await getUserProfileByUsername(user_name);
  if (!existingProfile) {
    throw new Error('Scout profile not found');
  }

  const mergedData = mergeUpdateFields(existingProfile, updateData);

  const query = `
    UPDATE scout_profile
    SET
      first_name = $1,
      last_name = $2,
      bio = $3,
      county = $4,
      organization = $5,
      experience_years = $6,
      specialization = $7
    WHERE user_name = $8
    RETURNING *;
  `;

  const values = [
    mergedData.first_name,
    mergedData.last_name,
    mergedData.bio,
    mergedData.county,
    mergedData.organization,
    mergedData.experience_years,
    mergedData.specialization,
    user_name,
  ];

  const { rows } = await db.query(query, values);
  return rows[0];
}

// ---------------------- INSTITUTION ----------------------

exports.createInstitutionProfile = async (user_name, data) => {
  const {
    institution_name, bio, county,
    institution_type, founded_year
  } = data;

  const query = `
    INSERT INTO institutions_profile (
      user_name, institution_name, bio, county, institution_type, founded_year
    ) VALUES ($1, $2, $3, $4, $5, $6)
  `;
  await db.query(query, [
    user_name, institution_name, bio, county, institution_type, founded_year
  ]);
};

exports.updateInstitutionProfile = async function(user_name, updateData) {
  const existingProfile = await getUserProfileByUsername(user_name);
  if (!existingProfile) {
    throw new Error('Institution profile not found');
  }

  const mergedData = mergeUpdateFields(existingProfile, updateData);

  const query = `
    UPDATE institutions_profile
    SET
      institution_name = $1,
      bio = $2,
      county = $3,
      institution_type = $4,
      founded_year = $5
    WHERE user_name = $6
    RETURNING *;
  `;

  const values = [
    mergedData.institution_name,
    mergedData.bio,
    mergedData.county,
    mergedData.institution_type,
    mergedData.founded_year,
    user_name,
  ];

  const { rows } = await db.query(query, values);
  return rows[0];
}

exports.getUserProfileByUsername = getUserProfileByUsername;
// ---------------------- MERGE UTILS ----------------------    

