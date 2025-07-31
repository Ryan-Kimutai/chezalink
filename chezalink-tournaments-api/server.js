const express = require('express');
const app = express();

// Import your tournament routes
const tournamentRoutes = require('./routes/tournamentRoutes');

// Middleware to parse incoming JSON
app.use(express.json());

// Base test route
app.get('/', (req, res) => {
  res.send('ChezaLink Tournament API is running');
});

// Use tournament routes
app.use('/', tournamentRoutes); // or app.use('/api', tournamentRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});





