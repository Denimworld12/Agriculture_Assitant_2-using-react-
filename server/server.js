const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express application
const app = express();
const port = process.env.PORT || 3000;

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production

// Middleware
app.use(cors());
app.use(bodyParser.json());
require('dotenv').config();
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};


// Create database pool
const pool = mysql.createPool(dbConfig);

// Registration endpoint
app.post('/api/register', async (req, res) => {
  let connection;
  
  try {
    const { 
      name, 
      email, 
      password, 
      phone, 
      address, 
      city, 
      state, 
      pincode, 
      role,
      farm_name,
      farm_size,
      farm_location,
      farm_description
    } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if email already exists
    connection = await pool.getConnection();
    const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length > 0) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Begin transaction
    await connection.beginTransaction();
    
    // Insert user data
    const [result] = await connection.query(
      'INSERT INTO users (name, email, password, phone, address, city, state, pincode, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, address, city, state, pincode, role]
    );
    
    const userId = result.insertId;
    
    // Insert farmer-specific data if role is farmer
    if (role === 'farmer' && userId) {
      await connection.query(
        'INSERT INTO farms (user_id, farm_name, farm_size, farm_location, farm_description) VALUES (?, ?, ?, ?, ?)',
        [userId, farm_name, farm_size, farm_location, farm_description]
      );
    }
    
    // Commit transaction
    await connection.commit();
    
    // Create user object to return (excluding password)
    const user = {
      id: userId,
      name,
      email,
      phone,
      role
    };
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user
    });
    
  } catch (error) {
    // Rollback transaction if error occurs
    if (connection) {
      await connection.rollback();
    }
    
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error occurred during registration' });
  } finally {
    // Release connection
    if (connection) {
      connection.release();
    }
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  let connection;

  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Get user from database
    connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT u.*, f.farm_name, f.farm_size, f.farm_location FROM users u LEFT JOIN farms f ON u.id = f.user_id WHERE u.email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create user object to return (excluding password)
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address,
      city: user.city,
      state: user.state,
      pincode: user.pincode
    };

    // Add farm details if user is a farmer
    if (user.role === 'farmer' && user.farm_name) {
      userResponse.farmDetails = {
        farm_name: user.farm_name,
        farm_size: user.farm_size,
        farm_location: user.farm_location
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error occurred during login' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Protected route example
app.get('/api/profile', authenticateToken, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT id, name, email, phone, role, address, city, state, pincode FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // If user is a farmer, get farm details
    if (user.role === 'farmer') {
      const [farms] = await connection.query(
        'SELECT farm_name, farm_size, farm_location, farm_description FROM farms WHERE user_id = ?',
        [user.id]
      );
      if (farms.length > 0) {
        user.farmDetails = farms[0];
      }
    }

    res.json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error occurred while fetching profile' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  let connection;

  try {
    connection = await pool.getConnection();
    const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create user response without sensitive data
    const userResponse = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});