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

  if (!user_name || !type) {
    return res.status(400).json({ error: 'user_name and type are required.' });
  }

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
        0,
        0,
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

// Get all posts for a specific user
const getUserPosts = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM posts WHERE user_name = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching user posts:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get the global feed (sorted by likes + recency)
const getFeed = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *, 
        (likes * 2 + EXTRACT(EPOCH FROM (NOW() - created_at)) * -0.001) AS score
      FROM posts
      ORDER BY score DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Error generating feed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Increment likes for a post
const likePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await pool.query(
      `UPDATE posts SET likes = likes + 1 WHERE post_id = $1 RETURNING *`,
      [postId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error liking post:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createPost,
  getUserPosts,
  getFeed,
  likePost
};
