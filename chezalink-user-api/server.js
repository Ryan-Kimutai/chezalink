require ('dotenv').config({ path: './chezalink-user-api/.env'});

const cors = require('cors');
const express = require('express');
const profileRoutes = require('./routes/userprofileroutes');
const app = express();
const PORT = process.env.USER_PROFILE_PORT || 4001;

// Middleware to parse JSON request bodies
app.use(express.json());

//Allow cross origin requests
app.use(cors());

// Mount profile routes under /api/profile
app.use('/api', profileRoutes);

// Start the server
app.listen(4001,'0.0.0.0', () => {
  console.log(`✅ User Profile API running on 0.0.0.0:4001`);
});
app.get('/', (req, res) => {
  res.send('User API is running');
});
