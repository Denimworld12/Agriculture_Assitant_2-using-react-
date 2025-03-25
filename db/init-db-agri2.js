const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',     // Update with your MySQL username
  password: '',     // Update with your MySQL password
  multipleStatements: true // Allow multiple SQL statements in one query
};

async function initializeDatabase() {
  let connection;
  
  try {
    // Connect to MySQL server
    console.log('Connecting to MySQL server...');
    connection = await mysql.createConnection(dbConfig);
    
    // Create database if it doesn't exist
    console.log('Creating database if it doesn\'t exist...');
    await connection.query('CREATE DATABASE IF NOT EXISTS agri2');
    
    // Use the agri2 database
    await connection.query('USE agri2');
    
    // Read SQL schema file
    console.log('Reading schema file...');
    const schemaPath = path.join(__dirname, 'schema-agri2.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the SQL schema
    console.log('Executing schema SQL...');
    await connection.query(schemaSql);
    
    console.log('Database initialized successfully with plain text passwords!');
    console.log('Sample user accounts created for testing:');
    console.log('---------------------------------------------');
    console.log('1. Admin User');
    console.log('   - Email: admin@example.com');
    console.log('   - Password: admin123');
    console.log('   - Role: admin');
    console.log('');
    console.log('2. Consumer User');
    console.log('   - Email: user@example.com');
    console.log('   - Password: user123');
    console.log('   - Role: consumer');
    console.log('');
    console.log('3. Farmer User');
    console.log('   - Email: farmer@example.com');
    console.log('   - Password: farmer123');
    console.log('   - Role: farmer');
    console.log('   - Farm: Green Acres Farm');
    console.log('---------------------------------------------');
    console.log('The application will auto-login with a random user when running in development mode.');
    
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initializeDatabase(); 