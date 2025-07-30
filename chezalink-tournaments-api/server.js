const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const tournamentRoutes = require('./routes/tournamentRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/', tournamentRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('ChezaLink Tournament API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});




