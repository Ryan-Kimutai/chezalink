const jwt = require('jsonwebtoken'); // For creating JWT tokens
const bcrypt = require('bcrypt');    // For hashing passwords
require('dotenv').config();          // Load variables from .env

// Temporary in-memory user store (will replace with a database later)
const users = [];

// Helper function to generate a JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },  // Payload to encode in token
    process.env.JWT_SECRET,             // Secret key to sign the token
    { expiresIn: '1w' }                 // Token expires in 1 week temporarily will change back to an 1hr later
  );
};

// Controller for user signup
const signup = async (req, res) => {
  const { name, email, password } = req.body; // Get user input

  // Check if the email is already registered
  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {
    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user object with hashed password
    const newUser = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword
    };

    // Store the user in the array
    users.push(newUser);

    // Generate a token for the new user
    const token = generateToken(newUser);

    // Send back the user data (excluding the password) and token
    res.status(201).json({
      message: 'User created',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Controller for user login
const login = async (req, res) => {
  const { email, password } = req.body; // Get login credentials

  // Find user by email
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  try {
    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a new token for the user
    const token = generateToken(user);

    // Send back the user data and token
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Controller to list all users (excluding passwords)TEMPORARY FOR TESTING
const getAllUsers = (req, res) => {
  const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);
  res.json(usersWithoutPasswords);
};
// Export the controller functions
module.exports = {
  signup,
  login,
  getAllUsers,
  users  // export users array for inspection (for testing only)
};

