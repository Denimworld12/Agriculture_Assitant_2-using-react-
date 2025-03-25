-- Agriculture Assistant Database Schema
-- This schema uses plain text passwords as specified

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS price_alerts;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS wishlist_items;
DROP TABLE IF EXISTS user_preferences;
DROP TABLE IF EXISTS government_schemes;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS news_articles;
DROP TABLE IF EXISTS equipment_bookings;
DROP TABLE IF EXISTS equipment_rentals;
DROP TABLE IF EXISTS market_prices;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS farmers;
DROP TABLE IF EXISTS users;

-- Create Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL, -- Plain text password as requested
    phone VARCHAR(15) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    role ENUM('user', 'farmer', 'admin') NOT NULL DEFAULT 'user',
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Farmers table
CREATE TABLE farmers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    farm_name VARCHAR(100),
    farm_location VARCHAR(255),
    farm_size VARCHAR(50),
    farm_description TEXT,
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    verification_document VARCHAR(255),
    bank_account_number VARCHAR(50),
    bank_ifsc_code VARCHAR(20),
    upi_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INT,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Create Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    category_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    quantity_available INT NOT NULL,
    images JSON, -- Stores an array of image URLs
    status ENUM('available', 'out_of_stock', 'hidden') DEFAULT 'available',
    is_organic BOOLEAN DEFAULT FALSE,
    harvest_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Create Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_state VARCHAR(100) NOT NULL,
    shipping_pincode VARCHAR(10) NOT NULL,
    shipping_method VARCHAR(50) DEFAULT 'standard',
    shipping_fee DECIMAL(10, 2) DEFAULT 0.00,
    payment_method ENUM('cod', 'online', 'upi') NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    order_status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Order Items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create Market Prices table
CREATE TABLE market_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category_id INT,
    min_price DECIMAL(10, 2) NOT NULL,
    max_price DECIMAL(10, 2) NOT NULL,
    avg_price DECIMAL(10, 2) NOT NULL,
    market_name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Create Equipment Rentals table
CREATE TABLE equipment_rentals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    rental_price DECIMAL(10, 2) NOT NULL,
    rental_period VARCHAR(50) NOT NULL, -- e.g., 'per day', 'per week'
    deposit_amount DECIMAL(10, 2) DEFAULT 0.00,
    availability_status ENUM('available', 'booked', 'maintenance') DEFAULT 'available',
    condition_status TEXT,
    images JSON, -- Stores an array of image URLs
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
);

-- Create Equipment Bookings table
CREATE TABLE equipment_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT NOT NULL,
    user_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    booking_status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (equipment_id) REFERENCES equipment_rentals(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create News Articles table
CREATE TABLE news_articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100),
    source VARCHAR(100),
    image_url VARCHAR(255),
    published_date DATE NOT NULL,
    category VARCHAR(50),
    tags JSON, -- Stores an array of tags
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Reviews table
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    reference_id INT NOT NULL, -- ID of product, farmer, or equipment
    reference_type ENUM('product', 'farmer', 'equipment') NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Carts table
CREATE TABLE carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Cart Items table
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY (cart_id, product_id)
);

-- Create Notifications table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Payments table
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    booking_id INT,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('cod', 'online', 'upi') NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(100),
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    FOREIGN KEY (booking_id) REFERENCES equipment_bookings(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Government Schemes table
CREATE TABLE government_schemes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    eligibility TEXT,
    benefits TEXT,
    application_process TEXT,
    start_date DATE,
    end_date DATE,
    document_url VARCHAR(255),
    website_url VARCHAR(255),
    contact_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create User Preferences table
CREATE TABLE user_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    language VARCHAR(20) DEFAULT 'en',
    notification_preferences JSON, -- Stores preferences for different notification types
    theme VARCHAR(20) DEFAULT 'light',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Wishlist Items table
CREATE TABLE wishlist_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, product_id)
);

-- Create Transactions table
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    farmer_id INT,
    order_id INT,
    booking_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    type ENUM('purchase', 'rental', 'refund', 'payout') NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE SET NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    FOREIGN KEY (booking_id) REFERENCES equipment_bookings(id) ON DELETE SET NULL
);

-- Create Price Alerts table
CREATE TABLE price_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    category_id INT,
    target_price DECIMAL(10, 2) NOT NULL,
    alert_type ENUM('above', 'below') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_notified TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Insert sample data (optional)
-- Insert sample categories
INSERT INTO categories (name, description, image) VALUES
('Vegetables', 'Fresh vegetables directly from farms', '/images/categories/vegetables.jpg'),
('Fruits', 'Seasonal and exotic fruits', '/images/categories/fruits.jpg'),
('Grains', 'Rice, wheat and other grains', '/images/categories/grains.jpg'),
('Dairy', 'Milk and milk products', '/images/categories/dairy.jpg'),
('Poultry', 'Eggs and chicken products', '/images/categories/poultry.jpg');

-- Insert sample admin user (password: admin123)
INSERT INTO users (name, email, password, phone, role, address, city, state, pincode) VALUES
('Admin User', 'admin@example.com', 'admin123', '9876543210', 'admin', '123 Admin Street', 'Delhi', 'Delhi', '110001');

-- Insert sample consumer (password: user123)
INSERT INTO users (name, email, password, phone, role, address, city, state, pincode) VALUES
('Test Consumer', 'user@example.com', 'user123', '9876543211', 'user', '456 User Lane', 'Mumbai', 'Maharashtra', '400001');

-- Insert sample farmer (password: farmer123)
INSERT INTO users (name, email, password, phone, role, address, city, state, pincode) VALUES
('Test Farmer', 'farmer@example.com', 'farmer123', '9876543212', 'farmer', '789 Farm Road', 'Pune', 'Maharashtra', '411001');

-- Add farmer details
INSERT INTO farmers (user_id, farm_name, farm_location, farm_size, farm_description, verification_status)
VALUES (3, 'Green Acres Farm', 'Pune, Maharashtra', '15 acres', 'Organic farm specializing in vegetables. Primary crops: Tomatoes, Potatoes, Onions.', 'verified');

-- Insert sample products
INSERT INTO products (farmer_id, category_id, name, description, price, unit, quantity_available, images, is_organic) VALUES
(1, 1, 'Fresh Tomatoes', 'Organically grown tomatoes', 40.00, 'kg', 100, '["images/products/tomatoes1.jpg", "images/products/tomatoes2.jpg"]', TRUE),
(1, 1, 'Potatoes', 'Farm fresh potatoes', 30.00, 'kg', 200, '["images/products/potatoes.jpg"]', FALSE),
(1, 2, 'Apples', 'Crisp and juicy apples', 120.00, 'kg', 50, '["images/products/apples.jpg"]', TRUE);

-- This completes the database schema creation with plain text passwords 