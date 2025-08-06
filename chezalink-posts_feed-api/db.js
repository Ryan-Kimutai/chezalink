const { Pool } = require('pg');
require('dotenv').config({ path: __dirname + '/.env' }); // Correct path to local .env

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

module.exports = pool;

