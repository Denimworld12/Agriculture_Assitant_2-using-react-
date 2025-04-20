import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'agriculture_assistant'
};

export async function POST(request: Request) {
  let connection;
  try {
    const { email, password, userType } = await request.json();

    if (!email || !password || !userType) {
      return NextResponse.json({
        success: false,
        error: 'Email, password, and user type are required'
      }, { status: 400 });
    }

    // Create database connection
    connection = await mysql.createConnection(dbConfig);

    // First get the user by email and role
    const [users]: any = await connection.execute(
      'SELECT id, name, email, password, role, phone, city, state FROM users WHERE email = ? AND role = ?',
      [email, userType]
    );

    if (users.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password'
      }, { status: 401 });
    }

    const foundUser = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, foundUser.password);

    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password'
      }, { status: 401 });
    }

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = foundUser;

    // If user is a farmer, get farm details
    if (userWithoutPassword.role === 'farmer') {
      const [farmRows]: any = await connection.execute(
        'SELECT * FROM farms WHERE user_id = ?',
        [userWithoutPassword.id]
      );
      if (farmRows.length > 0) {
        userWithoutPassword.farmDetails = farmRows[0];
      }
    }

    // Generate a simple token (in production, use a proper JWT)
    const token = Buffer.from(`${userWithoutPassword.id}:${userWithoutPassword.email}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'An error occurred during login'
    }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
