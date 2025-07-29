const { v4: uuidv4 } = require('uuid');

// In-memory storage for MVP
let posts = [];             // All posts
let follows = {};           // Map of userId -> array of followed userIds

// Create a new post (blog or video or image)
const createPost = (req, res) => {
  const { userId, type, content, videoUrl, imageUrl, tournamentId } = req.body;

  // Basic validation
  if (!userId || !type) {
    return res.status(400).json({ error: 'userId and type are required.' });
  }

  // Type-specific validations
  if (type === 'blog' && !content) {
    return res.status(400).json({ error: 'Blog posts require content.' });
  }
  if (type === 'video' && !videoUrl) {
    return res.status(400).json({ error: 'Video posts require a video URL.' });
  }
  if (type === 'image' && !content) {
    return res.status(400).json({ error: 'Image posts require image URL.' });
  }
  // Create the new post object
  const newPost = {
    id: uuidv4(),                         // Unique post ID
    userId,
    type,                                // 'blog', 'video', 'image'
    content: content || '',              // Optional text (even for videos)
    videoUrl: videoUrl || '',            // Optional Cloudinary video URL
    imageUrl: imageUrl || '',            // Optional Cloudinary image URL
    tournamentId: tournamentId || null,  // Optional reference to tournament
    likes: 0,
    views: 0,
    createdAt: new Date().toISOString()
  };

  // Save to in-memory store
  posts.push(newPost);

  res.status(201).json(newPost);
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
