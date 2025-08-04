require ('dotenv').config({ path: './chezalink-user-api/.env'});

const express = require('express');
const profileRoutes = require('./routes/userprofileroutes');

const app = express();
const PORT = process.env.USER_PROFILE_PORT || 4001;

// Middleware to parse JSON request bodies
app.use(express.json());

// Mount profile routes under /api/profile
app.use('/api', profileRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`✅ User Profile API running on port ${PORT}`);
});
app.get('/', (req, res) => {
  res.send('User API is running');
});
