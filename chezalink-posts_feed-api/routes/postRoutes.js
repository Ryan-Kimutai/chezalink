const express = require('express');
const router = express.Router();
const {
  createPost,
  getUserPosts,
  getFeed,
  likePost
} = require('../controllers/postController');

const { uploadVideo, uploadImage } = require('../middlewares/upload');

// Create a new post
router.post('/', createPost);

// Get posts by a specific user
router.get('/user/:userId', getUserPosts);

// Get global feed
router.get('/feed/:userId', getFeed);  // Optionally drop :userId if no longer needed

// Like a post
router.post('/like/:postId', likePost);

// Upload video
router.post('/upload-video', uploadVideo.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No video uploaded' });
  res.json({ videoUrl: req.file.path });
});

// Upload image
router.post('/upload-image', uploadImage.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
  res.json({ imageUrl: req.file.path });
});

module.exports = router;
