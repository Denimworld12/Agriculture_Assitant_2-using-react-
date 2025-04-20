import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'kali',
  database: 'agriculture_assistant'
};

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    
    // Create database connection
    const connection = await mysql.createConnection(dbConfig);

    try {
      // First check if user already exists
      const [existingUsers]: any = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        [userData.email]
      );

      if (existingUsers.length > 0) {
        await connection.end();
        return NextResponse.json({
          success: false,
          error: 'Email already registered'
        }, { status: 400 });
      }

      // Insert new user
      const [result]: any = await connection.execute(
        'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
        [userData.name, userData.email, userData.password, userData.phone, userData.role]
      );

      const userId = result.insertId;

      // If user is a farmer, add farmer-specific details
      if (userData.role === 'farmer') {
        await connection.execute(
          'INSERT INTO farmer_details (user_id, business_type, farm_size, primary_crops, farm_location) VALUES (?, ?, ?, ?, ?)',
          [
            userId,
            userData.business_type,
            userData.farm_size,
            userData.primary_crops,
            `${userData.city}, ${userData.state}`
          ]
        );
      }

      await connection.end();

      // Get the created user (without password)
      const user = {
        id: userId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role
      };

      return NextResponse.json({
        success: true,
        user: user,
        token: `user_${userId}` // Simple token for now
      });
    } catch (error) {
      await connection.end();
      throw error;
    }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({
      success: false,
      error: 'An error occurred while creating your account'
    }, { status: 500 });
  }
}
