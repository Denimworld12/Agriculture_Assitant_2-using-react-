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
    await connection.query('CREATE DATABASE IF NOT EXISTS agriculture_assistant');
    
    // Use the agriculture_assistant database
    await connection.query('USE agriculture_assistant');
    
    // Read SQL schema file
    console.log('Reading schema file...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the SQL schema
    console.log('Executing schema SQL...');
    await connection.query(schemaSql);
    
    console.log('Database initialized successfully with plain text passwords!');
    console.log('Sample users created:');
    console.log('- Admin: admin@example.com / admin123');
    console.log('- Consumer: user@example.com / user123');
    console.log('- Farmer: farmer@example.com / farmer123');
    
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