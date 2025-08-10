require ('dotenv').config();

const cors = require('cors');
const express = require('express');
const socialRoutes = require('./routes/social.routes');
const verifyToken = require('../chezalink-auth-api/middleware/verifyToken');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const app = express();
const PORT = process.env.SOCIAL_API_PORT || 4002;

app.use(express.json());

//Allow cross-origin request 
app.use(cors());

// Middleware to verify JWT token
app.use('/api/social', socialRoutes); // ✅ Let the router decide which routes need tokens


app.listen(PORT, () => {
  console.log(`✅ Social API running on port ${PORT}`);
});
