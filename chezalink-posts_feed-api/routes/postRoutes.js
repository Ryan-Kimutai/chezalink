const express = require('express');
const router = express.Router();

const {
  createPost,
  getUserPosts,
  getFeed,
  likePost,
  unlikePost,
  getPostLikers
} = require('../controllers/postController');

const { uploadVideo, uploadImage } = require('../middlewares/upload');

// Create a new post
router.post('/', createPost);

// Get posts by a specific user
router.get('/user/:userId', getUserPosts);

// Get global feed (with optional pagination: ?limit=10&offset=0&user_name=xyz)
router.get('/feed', getFeed);

// Like a post
router.post('/like/:postId', likePost);

// Unlike a post
router.delete('/like/:postId', unlikePost);  // Assumes user_name in body

// Get users who liked a post
router.get('/:postId/likes', getPostLikers);

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
