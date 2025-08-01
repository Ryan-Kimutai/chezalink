const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config(); // Load from shared .env

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL database'))
  .catch((err) => console.error('❌ Database connection error:', err));
  
module.exports = pool;
