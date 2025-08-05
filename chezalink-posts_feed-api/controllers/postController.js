const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

// Create a new post (blog, video, or image)
const createPost = async (req, res) => {
  const {
    user_name,
    type,
    content,
    videoUrl,
    imageUrl
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
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        post_id,
        user_name,
        type,
        content || '',
        videoUrl || '',
        imageUrl || '',
        created_at,

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


// Get the global feed (with like count, is_liked, and pagination)
const getFeed = async (req, res) => {
  const { user_name } = req.query;
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const result = await pool.query(`
      SELECT 
        posts.*,
        COUNT(likes.post_id) AS like_count,
        EXISTS (
          SELECT 1 FROM likes l
          WHERE l.post_id = posts.post_id AND l.user_name = $1
        ) AS is_liked,
        (COUNT(likes.post_id) * 2 + EXTRACT(EPOCH FROM (NOW() - posts.created_at)) * -0.001) AS score
      FROM posts
      LEFT JOIN likes ON posts.post_id = likes.post_id
      GROUP BY posts.post_id
      ORDER BY score DESC
      LIMIT $2 OFFSET $3
    `, [user_name, limit, offset]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error generating feed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Like a post (no duplicates)

const likePost = async (req, res) => {
  const { postId } = req.params;
  const { user_name } = req.body;  // FIXED LINE

  try {
    await pool.query(
      `INSERT INTO likes (post_id, user_name, liked_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT DO NOTHING`,
      [postId, user_name]
    );

    const likeResult = await pool.query(
      `SELECT COUNT(*) AS like_count FROM likes WHERE post_id = $1`,
      [postId]
    );

    res.json({ post_id: postId, like_count: likeResult.rows[0].like_count });
  } catch (err) {
    console.error('Error liking post:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Unlike a post
const unlikePost = async (req, res) => {
  const { postId } = req.params;
  const { user_name } = req.body;

  try {
    await pool.query(
      `DELETE FROM likes WHERE post_id = $1 AND user_name = $2`,
      [postId, user_name]
    );

    const likeResult = await pool.query(
      `SELECT COUNT(*) AS like_count FROM likes WHERE post_id = $1`,
      [postId]
    );

    res.json({ post_id: postId, like_count: likeResult.rows[0].like_count });
  } catch (err) {
    console.error('Error unliking post:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get list of users who liked a post
const getPostLikers = async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await pool.query(
      `SELECT user_name
       FROM likes
       WHERE post_id = $1
       ORDER BY liked_at DESC
       LIMIT 50`,
      [postId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching likers:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createPost,
  getUserPosts,
  getFeed,
  likePost,
  unlikePost,
  getPostLikers
};
