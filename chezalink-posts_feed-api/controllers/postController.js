const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

// Create a new post (blog, video, or image)
const createPost = async (req, res) => {
  const {
    user_name,
    type,
    content,
    videoUrl,
    imageUrl,
    tournamentId,
    post_origin
  } = req.body;

  // Basic validation
  if (!user_name || !type) {
    return res.status(400).json({ error: 'user_name and type are required.' });
  }

  // Type-specific validations
  if (type === 'blog' && !content) {
    return res.status(400).json({ error: 'Blog posts require content.' });
  }
  if (type === 'video' && !videoUrl) {
    return res.status(400).json({ error: 'Video posts require a video URL.' });
  }
  if (type === 'image' && !imageUrl) {
    return res.status(400).json({ error: 'Image posts require an image URL.' });
  }

  const post_id = uuidv4();
  const created_at = new Date().toISOString();

  try {
    const result = await pool.query(
      `INSERT INTO posts (
        post_id,
        user_name,
        type,
        content,
        video_url,
        image_url,
        tournament_id,
        likes,
        views,
        created_at,
        post_origin
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        post_id,
        user_name,
        type,
        content || '',
        videoUrl || '',
        imageUrl || '',
        tournamentId || null,
        0, // likes (set to 0 explicitly)
        0, // views (set to 0 explicitly)
        created_at,
        post_origin || 'user'
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating post:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all posts for a given user
const getUserPosts = (req, res) => {
  const { userId } = req.params;
  const userPosts = posts.filter(post => post.userId === userId);
  res.json(userPosts);
};

// Generate a personalized feed for a user
const getFeed = (req, res) => {
  const { userId } = req.params;
  const followed = follows[userId] || [];

  // If user follows others, filter their posts. Otherwise, return all posts.
  let feedPosts = followed.length > 0
    ? posts.filter(post => followed.includes(post.userId))
    : [...posts];

  // Sort by combined engagement and recency score
  feedPosts.sort((a, b) => {
    const scoreA = a.likes * 2 + a.views + new Date(a.createdAt).getTime() / 1e6;
    const scoreB = b.likes * 2 + b.views + new Date(b.createdAt).getTime() / 1e6;
    return scoreB - scoreA; // Higher score first
  });

  res.json(feedPosts);
};

module.exports = {
  createPost,
  getUserPosts,
  getFeed
};
