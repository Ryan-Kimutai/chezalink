const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './chezalink-auth-api/.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth.routes');
const protectedRoutes = require('./routes/protected.routes'); 

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes); 

// Root test route
app.get('/', (req, res) => {
  res.send('Auth API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Auth API server running on port ${PORT}`);
});
