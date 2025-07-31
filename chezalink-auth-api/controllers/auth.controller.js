const jwt = require('jsonwebtoken'); // For creating JWT tokens
const pool = require('../db'); // PostgreSQL connection
const bcrypt = require('bcrypt'); // For password hashing
require('dotenv').config(); // Load environment variables

// Generate JWT token using user ID and email
const generateToken = (user) => {
  return jwt.sign(
    { id: user.user_id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1w' } // Temporary token expiration of 1 week will change in production to 1h
  );
};

// Controller for user signup
const signup = async (req, res) => {
  const { user_name, email, password } = req.body;

  try {
    // Check if email already exists
    const userCheck = await pool.query('SELECT * FROM accounts WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user into the database
    const newUserResult = await pool.query(
      'INSERT INTO accounts (user_name, email, password) VALUES ($1, $2, $3) RETURNING user_id, user_name, email',
      [user_name, email, hashedPassword]
    );

    const newUser = newUserResult.rows[0];

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User created',
      user: {
        id: newUser.user_id,
        name: newUser.user_name,
        email: newUser.email
      },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Something went wrong', detail: error.message });
  }
};

// Controller for user login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Get user from database
    const result = await pool.query('SELECT * FROM accounts WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      user: {
        id: user.user_id,
        name: user.user_name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Get all users without password (FOR TESTING ONLY)
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT user_id, user_name, email FROM accounts');
    res.json(result.rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

module.exports = {
  signup,
  login,
  getAllUsers
};
