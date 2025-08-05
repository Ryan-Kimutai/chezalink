const { Pool } = require('pg');
require('dotenv').config({ path: './chezalink-social-api/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(client => {
    console.log('✅ Connected to PostgreSQL database');
    client.release();
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.stack);
  });


module.exports = pool;
