const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Import routes
const authRoutes = require('./routes/auth.routes');
const protectedRoutes = require('./routes/protected.routes'); // ⬅️ Add this line

// ✅ Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes); // ⬅️ Add this line

// Root test route
app.get('/', (req, res) => {
  res.send('Auth API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Auth API server running on port ${PORT}`);
});
