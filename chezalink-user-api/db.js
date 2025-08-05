const { Pool } = require('pg');
require('dotenv').config({ path: './chezalink-user-api/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL database'))
  .catch((err) => console.error('❌ Database connection error:', err));
  
module.exports = pool;
