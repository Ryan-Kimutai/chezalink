const express = require('express');
const dotenv = require('dotenv');
const profileRoutes = require('./routes/profile.routes');

dotenv.config(); // Load from shared .env

const app = express();
const PORT = process.env.USER_PROFILE_PORT || 4001;

app.use(express.json());

// Routes
app.use('/api/profile', profileRoutes);

app.listen(PORT, () => {
  console.log(`User Profile API running on port ${PORT}`);
});
