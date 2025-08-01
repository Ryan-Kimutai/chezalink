const express = require('express');
const dotenv = require('dotenv');
const socialRoutes = require('./routes/social.routes');

dotenv.config(); // Load from shared .env

const app = express();
const PORT = process.env.SOCIAL_API_PORT || 4002;

app.use(express.json());

app.use((req, res, next) => {
  req.user = { id: 'mock-user-id', role: 'user' };
  next();
});

// Routes
app.use('/api/social', socialRoutes);

app.listen(PORT, () => {
  console.log(`Social API running on port ${PORT}`);
});
