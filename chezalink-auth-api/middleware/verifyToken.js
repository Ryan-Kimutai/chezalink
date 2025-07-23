const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if authorization header is present and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Get the token from the header
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to the request for use in the route
    req.user = decoded;

    // Continue to the next middleware or route
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;
