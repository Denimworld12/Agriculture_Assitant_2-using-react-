import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'your-secret-key-here'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Hardcoded admin credentials for testing
    if (email === 'admin@example.com' && password === 'admin123') {
      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: 'admin-1',
          email: email,
          role: 'admin' 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      )

      return NextResponse.json({
        success: true,
        token,
        userId: 'admin-1',
        name: 'Admin User',
        email: email,
        role: 'admin'
      })
    }

    return NextResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
