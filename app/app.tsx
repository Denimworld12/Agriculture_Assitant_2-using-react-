"use client"

import { useEffect, useState } from 'react'

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)
  
  useEffect(() => {
    // Check if we should auto-login in development environment
    if (process.env.NODE_ENV === 'development') {
      const autoLogin = async () => {
        // Only auto-login if no existing session
        const existingToken = localStorage.getItem('auth-token')
        if (existingToken) {
          console.log('User already logged in, skipping auto-login')
          return
        }
        
        try {
          console.log('Development auto-login activated')
          
          // Random selection between admin, consumer, and farmer
          const userTypes = ['admin', 'consumer', 'farmer']
          const randomType = userTypes[Math.floor(Math.random() * userTypes.length)]
          
          // Credentials based on user type
          let credentials = { email: '', password: '' }
          
          switch (randomType) {
            case 'admin':
              credentials = { email: 'admin@example.com', password: 'admin123' }
              break
            case 'consumer':
              credentials = { email: 'user@example.com', password: 'user123' }
              break
            case 'farmer':
              credentials = { email: 'farmer@example.com', password: 'farmer123' }
              break
          }
          
          // Make the login API call
          const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          })
          
          if (!response.ok) {
            throw new Error('Auto-login failed')
          }
          
          const data = await response.json()
          
          // Store the auth token
          localStorage.setItem('auth-token', data.token)
          
          // Store basic user info
          localStorage.setItem('user-data', JSON.stringify({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role
          }))
          
          console.log(`Auto-logged in as ${randomType}: ${credentials.email}`)
        } catch (error) {
          console.error('Auto-login error:', error)
        }
      }
      
      autoLogin()
    }
    
    setIsInitialized(true)
  }, [])
  
  if (!isInitialized && process.env.NODE_ENV === 'development') {
    return <div className="p-8 text-center">Initializing development environment...</div>
  }
  
  return <>{children}</>
} 