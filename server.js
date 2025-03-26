import express from 'express';
const mysql = require('mysql2/promise');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',     // Update with your MySQL username
  password: '',     // Update with your MySQL password
  database: 'agriculture_assistant',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper function for executing SQL queries
const executeQuery = async (sql, params = []) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// JWT Secret
const JWT_SECRET = 'agriculture-assistant-secret-key';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Register a new user
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, password, role, address, city, state, pincode, farmDetails } = req.body;
    
    // Check if user already exists
    const existingUser = await executeQuery('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Insert user with plain text password
    const result = await executeQuery(
      'INSERT INTO users (name, email, password, phone, role, address, city, state, pincode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, password, phone, role || 'user', address, city, state, pincode]
    );
    
    const userId = result.insertId;
    
    // If registering as a farmer, create farmer profile
    if (role === 'farmer' && farmDetails) {
      await executeQuery(
        'INSERT INTO farmers (user_id, farm_name, farm_location, farm_size, farm_description) VALUES (?, ?, ?, ?, ?)',
        [userId, farmDetails.farmName, farmDetails.location, farmDetails.size, farmDetails.description]
      );
    }
    
    // Create a cart for the user
    await executeQuery('INSERT INTO carts (user_id) VALUES (?)', [userId]);
    
    // Generate JWT token
    const token = jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '1d' });
    
    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        name,
        email,
        role
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Get user with plain text password
    const users = await executeQuery('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const user = users[0];
    
    // Compare plain text password
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // If user is a farmer, get farmer details
    let farmerDetails = null;
    if (user.role === 'farmer') {
      const farmers = await executeQuery('SELECT * FROM farmers WHERE user_id = ?', [user.id]);
      if (farmers.length > 0) {
        farmerDetails = farmers[0];
      }
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode
      },
      farmer: farmerDetails
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Get user profile with comprehensive data
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user data
    const users = await executeQuery('SELECT id, name, email, phone, role, address, city, state, pincode, avatar FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = users[0];
    
    // Get farmer details if applicable
    let farmer = null;
    if (user.role === 'farmer') {
      const farmers = await executeQuery('SELECT * FROM farmers WHERE user_id = ?', [userId]);
      if (farmers.length > 0) {
        farmer = farmers[0];
      }
    }
    
    // Get recent orders
    const recentOrders = await executeQuery(`
      SELECT o.*, 
             (SELECT JSON_ARRAYAGG(JSON_OBJECT(
               'id', oi.id,
               'product_id', oi.product_id,
               'quantity', oi.quantity,
               'price_per_unit', oi.price_per_unit,
               'total_price', oi.total_price,
               'product_name', (SELECT name FROM products WHERE id = oi.product_id)
             ))
             FROM order_items oi WHERE oi.order_id = o.id) as items
      FROM orders o 
      WHERE o.user_id = ? 
      ORDER BY o.created_at DESC 
      LIMIT 5`, [userId]);
    
    // Get cart items
    const cart = await executeQuery(`
      SELECT c.id FROM carts c WHERE c.user_id = ?`, [userId]);
    
    let cartItems = [];
    if (cart.length > 0) {
      cartItems = await executeQuery(`
        SELECT ci.*, p.name, p.price, p.unit, p.images
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.cart_id = ?`, [cart[0].id]);
    }
    
    // Get wishlist items
    const wishlistItems = await executeQuery(`
      SELECT w.*, p.name, p.price, p.unit, p.images
      FROM wishlist_items w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?`, [userId]);
    
    // Get equipment rentals if farmer
    let equipmentRentals = [];
    if (user.role === 'farmer' && farmer) {
      equipmentRentals = await executeQuery(`
        SELECT er.*, 
               (SELECT COUNT(*) FROM equipment_bookings eb WHERE eb.equipment_id = er.id) as total_bookings
        FROM equipment_rentals er
        WHERE er.farmer_id = ?`, [farmer.id]);
    }
    
    // Get products if farmer
    let products = [];
    if (user.role === 'farmer' && farmer) {
      products = await executeQuery(`
        SELECT p.*, 
               (SELECT COUNT(*) FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE oi.product_id = p.id) as total_orders
        FROM products p
        WHERE p.farmer_id = ?`, [farmer.id]);
    }
    
    res.json({
      user,
      farmer,
      recentOrders,
      cartItems,
      wishlistItems,
      equipmentRentals,
      products
    });
    
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
});

// Update user profile
app.put('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, address, city, state, pincode, password, farmDetails } = req.body;
    
    // Update user data
    const updateFields = [];
    const updateValues = [];
    
    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    
    if (phone) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }
    
    if (address) {
      updateFields.push('address = ?');
      updateValues.push(address);
    }
    
    if (city) {
      updateFields.push('city = ?');
      updateValues.push(city);
    }
    
    if (state) {
      updateFields.push('state = ?');
      updateValues.push(state);
    }
    
    if (pincode) {
      updateFields.push('pincode = ?');
      updateValues.push(pincode);
    }
    
    if (password) {
      // Update plain text password
      updateFields.push('password = ?');
      updateValues.push(password);
    }
    
    if (updateFields.length > 0) {
      updateValues.push(userId);
      await executeQuery(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }
    
    // Update farmer details if applicable
    if (req.user.role === 'farmer' && farmDetails) {
      const farmers = await executeQuery('SELECT * FROM farmers WHERE user_id = ?', [userId]);
      
      if (farmers.length > 0) {
        const farmUpdateFields = [];
        const farmUpdateValues = [];
        
        if (farmDetails.farmName) {
          farmUpdateFields.push('farm_name = ?');
          farmUpdateValues.push(farmDetails.farmName);
        }
        
        if (farmDetails.location) {
          farmUpdateFields.push('farm_location = ?');
          farmUpdateValues.push(farmDetails.location);
        }
        
        if (farmDetails.size) {
          farmUpdateFields.push('farm_size = ?');
          farmUpdateValues.push(farmDetails.size);
        }
        
        if (farmDetails.description) {
          farmUpdateFields.push('farm_description = ?');
          farmUpdateValues.push(farmDetails.description);
        }
        
        if (farmUpdateFields.length > 0) {
          farmUpdateValues.push(userId);
          await executeQuery(
            `UPDATE farmers SET ${farmUpdateFields.join(', ')} WHERE user_id = ?`,
            farmUpdateValues
          );
        }
      }
    }
    
    res.json({ message: 'Profile updated successfully' });
    
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

// Get all products with filtering options
app.get('/api/products', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, farmer_id, organic, sort } = req.query;
    
    let query = `
      SELECT p.*, c.name as category_name, f.farm_name, u.name as farmer_name, 
             (SELECT AVG(rating) FROM reviews WHERE reference_id = p.id AND reference_type = 'product') as avg_rating,
             (SELECT COUNT(*) FROM reviews WHERE reference_id = p.id AND reference_type = 'product') as review_count
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN farmers f ON p.farmer_id = f.id
      JOIN users u ON f.user_id = u.id
      WHERE p.status = 'available'
    `;
    
    const params = [];
    
    // Apply filters
    if (category) {
      query += ' AND p.category_id = ?';
      params.push(category);
    }
    
    if (minPrice) {
      query += ' AND p.price >= ?';
      params.push(minPrice);
    }
    
    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(maxPrice);
    }
    
    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (farmer_id) {
      query += ' AND p.farmer_id = ?';
      params.push(farmer_id);
    }
    
    if (organic === 'true') {
      query += ' AND p.is_organic = 1';
    }
    
    // Apply sorting
    if (sort === 'price_asc') {
      query += ' ORDER BY p.price ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY p.price DESC';
    } else if (sort === 'newest') {
      query += ' ORDER BY p.created_at DESC';
    } else if (sort === 'rating') {
      query += ' ORDER BY avg_rating DESC';
    } else {
      query += ' ORDER BY p.created_at DESC';
    }
    
    const products = await executeQuery(query, params);
    
    res.json({ products });
    
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// Add a new product (farmer only)
app.post('/api/products', authenticateToken, upload.array('images', 5), async (req, res) => {
  try {
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ message: 'Only farmers can add products' });
    }
    
    const { name, description, price, unit, quantity, category_id, is_organic, harvest_date, expiry_date } = req.body;
    
    // Get farmer ID from user_id
    const farmers = await executeQuery('SELECT id FROM farmers WHERE user_id = ?', [req.user.id]);
    
    if (farmers.length === 0) {
      return res.status(404).json({ message: 'Farmer profile not found' });
    }
    
    const farmerId = farmers[0].id;
    
    // Process uploaded images
    const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    // Insert product
    const result = await executeQuery(
      `INSERT INTO products (
        farmer_id, category_id, name, description, price, unit, quantity_available, 
        images, is_organic, harvest_date, expiry_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        farmerId, 
        category_id, 
        name, 
        description, 
        price, 
        unit, 
        quantity, 
        JSON.stringify(imageUrls),
        is_organic === 'true' ? 1 : 0,
        harvest_date || null,
        expiry_date || null
      ]
    );
    
    res.status(201).json({ 
      message: 'Product added successfully',
      product_id: result.insertId
    });
    
  } catch (error) {
    console.error('Product add error:', error);
    res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
});

// Get product by ID with reviews
app.get('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Get product details with farmer info
    const products = await executeQuery(`
      SELECT p.*, c.name as category_name, f.farm_name, f.id as farmer_id, 
             u.name as farmer_name, u.id as farmer_user_id,
             (SELECT AVG(rating) FROM reviews WHERE reference_id = p.id AND reference_type = 'product') as avg_rating,
             (SELECT COUNT(*) FROM reviews WHERE reference_id = p.id AND reference_type = 'product') as review_count
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN farmers f ON p.farmer_id = f.id
      JOIN users u ON f.user_id = u.id
      WHERE p.id = ?
    `, [productId]);
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const product = products[0];
    
    // Get reviews
    const reviews = await executeQuery(`
      SELECT r.*, u.name as reviewer_name, u.avatar as reviewer_avatar
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.reference_id = ? AND r.reference_type = 'product'
      ORDER BY r.created_at DESC
    `, [productId]);
    
    // Get related products in the same category
    const relatedProducts = await executeQuery(`
      SELECT p.id, p.name, p.price, p.unit, p.images, p.is_organic
      FROM products p
      WHERE p.category_id = ? AND p.id != ? AND p.status = 'available'
      LIMIT 6
    `, [product.category_id, productId]);
    
    res.json({
      product,
      reviews,
      relatedProducts
    });
    
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
});

// Place an order
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      items, 
      totalAmount, 
      shippingAddress, 
      shippingCity, 
      shippingState, 
      shippingPincode,
      paymentMethod 
    } = req.body;
    
    if (!items || !items.length) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }
    
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Create order
      const [orderResult] = await connection.execute(
        `INSERT INTO orders (
          user_id, total_amount, shipping_address, shipping_city, shipping_state, 
          shipping_pincode, payment_method, payment_status, order_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId, 
          totalAmount, 
          shippingAddress, 
          shippingCity, 
          shippingState, 
          shippingPincode,
          paymentMethod,
          paymentMethod === 'cod' ? 'pending' : 'completed',
          'pending'
        ]
      );
      
      const orderId = orderResult.insertId;
      
      // Insert order items and update product quantities
      for (const item of items) {
        // Check product availability
        const [productRows] = await connection.execute(
          'SELECT quantity_available FROM products WHERE id = ?',
          [item.productId]
        );
        
        if (productRows.length === 0) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }
        
        if (productRows[0].quantity_available < item.quantity) {
          throw new Error(`Insufficient quantity available for product with ID ${item.productId}`);
        }
        
        // Add order item
        await connection.execute(
          'INSERT INTO order_items (order_id, product_id, quantity, price_per_unit, total_price) VALUES (?, ?, ?, ?, ?)',
          [orderId, item.productId, item.quantity, item.price, item.price * item.quantity]
        );
        
        // Update product quantity
        await connection.execute(
          'UPDATE products SET quantity_available = quantity_available - ? WHERE id = ?',
          [item.quantity, item.productId]
        );
        
        // Update product status if out of stock
        await connection.execute(
          'UPDATE products SET status = IF(quantity_available <= 0, "out_of_stock", status) WHERE id = ?',
          [item.productId]
        );
      }
      
      // Create payment record
      await connection.execute(
        'INSERT INTO payments (order_id, user_id, amount, payment_method, payment_status) VALUES (?, ?, ?, ?, ?)',
        [
          orderId, 
          userId, 
          totalAmount, 
          paymentMethod, 
          paymentMethod === 'cod' ? 'pending' : 'completed'
        ]
      );
      
      // Create transaction record
      await connection.execute(
        'INSERT INTO transactions (user_id, order_id, amount, type, status) VALUES (?, ?, ?, ?, ?)',
        [
          userId, 
          orderId, 
          totalAmount, 
          'purchase', 
          paymentMethod === 'cod' ? 'pending' : 'completed'
        ]
      );
      
      // Clear cart if order placed successfully
      const [cartRows] = await connection.execute(
        'SELECT id FROM carts WHERE user_id = ?',
        [userId]
      );
      
      if (cartRows.length > 0) {
        await connection.execute(
          'DELETE FROM cart_items WHERE cart_id = ?',
          [cartRows[0].id]
        );
      }
      
      // Create notification for user
      await connection.execute(
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        [
          userId, 
          'Order Placed Successfully', 
          `Your order #${orderId} has been placed successfully.`, 
          'order'
        ]
      );
      
      // Create notifications for farmers
      // Get unique farmer IDs from the order
      const [farmerRows] = await connection.execute(`
        SELECT DISTINCT f.user_id
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN farmers f ON p.farmer_id = f.id
        WHERE oi.order_id = ?
      `, [orderId]);
      
      for (const farmer of farmerRows) {
        await connection.execute(
          'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
          [
            farmer.user_id, 
            'New Order Received', 
            `You have received a new order #${orderId}.`, 
            'order'
          ]
        );
      }
      
      await connection.commit();
      
      res.status(201).json({ 
        message: 'Order placed successfully', 
        orderId 
      });
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
});

// Get user's orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const orders = await executeQuery(`
      SELECT o.*, 
             (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count,
             (SELECT JSON_ARRAYAGG(JSON_OBJECT(
               'id', oi.id,
               'product_id', oi.product_id,
               'quantity', oi.quantity,
               'price_per_unit', oi.price_per_unit,
               'total_price', oi.total_price,
               'product_name', (SELECT name FROM products WHERE id = oi.product_id),
               'product_image', (SELECT JSON_EXTRACT(images, '$[0]') FROM products WHERE id = oi.product_id)
             ))
             FROM order_items oi WHERE oi.order_id = o.id) as items
      FROM orders o 
      WHERE o.user_id = ? 
      ORDER BY o.created_at DESC
    `, [userId]);
    
    res.json({ orders });
    
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 