require('dotenv').config({ path: './chezalink-posts_feed-api/.env' });

const express = require('express');
const cors = require('cors'); 
const postRoutes = require('./routes/postRoutes');

const app = express();

app.use(cors());              
app.use(express.json());

// Optional root route
app.get('/', (req, res) => {
  res.send('Post API is running');
});

// Routes
app.use('/api/posts', postRoutes);

// Listen on all IPs so other devices can connect
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Post API running on port ${PORT}`));



