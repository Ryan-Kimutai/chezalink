const express = require('express');
const statsRoutes = require('./routes/statsRoutes'); // Import stats routes

const app = express();

app.use(express.json());

// Routes for all /api/stats endpoints
app.use('/api/stats', statsRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Stats API running on port ${PORT}`));
