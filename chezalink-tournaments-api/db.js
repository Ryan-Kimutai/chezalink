const { Pool } = require('pg');
require('dotenv').config({ path:'./chezalink-auth-api/.env' });

const pool = new Pool({
  host: process.env.DB_HOST,       // ← from .env
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL database'))
  .catch((err) => console.error('❌ Database connection error:', err));

module.exports = pool;