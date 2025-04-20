import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'kali',
  database: 'agriculture_assistant'
};

export async function GET(request: Request) {
  let connection;
  try {
    // Get auth token from header
    const authToken = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!authToken) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    // Decode token (in production, use proper JWT verification)
    const [userId] = Buffer.from(authToken, 'base64').toString().split(':');

    // Create database connection
    connection = await mysql.createConnection(dbConfig);

    // Get user data
    const [rows]: any = await connection.execute(
      'SELECT id, name, email, role, phone, city, state FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    const user = rows[0];

    // If user is a farmer, get farmer details
    if (user.role === 'farmer') {
      const [farmerRows]: any = await connection.execute(
        'SELECT * FROM farmers WHERE user_id = ?',
        [user.id]
      );
      if (farmerRows.length > 0) {
        user.farmerDetails = farmerRows[0];
      }
    }

    return NextResponse.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json({
      success: false,
      error: 'An error occurred while fetching profile'
    }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
