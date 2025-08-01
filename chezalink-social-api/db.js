const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config(); // Load from shared .env

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
