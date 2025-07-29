const express = require('express');
const router = express.Router();
const {
  createPost,
  getUserPosts,
  getFeed
} = require('../controllers/postController');

// POST /api/posts/ → Create a new post
router.post('/', createPost);

// GET /api/posts/user/:userId → Get all posts by a specific user
router.get('/user/:userId', getUserPosts);

// GET /api/posts/feed/:userId → Get the personalized feed for a user
router.get('/feed/:userId', getFeed);

const { uploadVideo, uploadImage } = require('../middlewares/upload');

// Upload video endpoint
router.post('/upload-video', uploadVideo.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No video uploaded' });
  res.json({ videoUrl: req.file.path });
});

// Upload image endpoint
router.post('/upload-image', uploadImage.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
  res.json({ imageUrl: req.file.path });
});



module.exports = router;
