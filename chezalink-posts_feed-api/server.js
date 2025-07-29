require('dotenv').config();

const express = require('express');
const postRoutes = require('./routes/postRoutes');
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

// Use the post routes for anything under /api/posts
app.use('/api/posts', postRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Post API running on port ${PORT}`));

