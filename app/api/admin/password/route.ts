import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

// In-memory storage for demo purposes
// In production, this should be stored in a secure database or Vercel KV
let storedPassword: string = ''

// GET - Retrieve current password
export async function GET() {
  try {
    return NextResponse.json({
      password: storedPassword,
      hasPassword: !!storedPassword,
    })
  } catch (error) {
    console.error('Error fetching password:', error)
    return NextResponse.json(
      { error: 'Failed to fetch password' },
      { status: 500 }
    )
  }
}

// POST - Update password
export async function POST(request: NextRequest) {
  try {
    const { newPassword, currentPassword } = await request.json()
    
    // Validate inputs
    if (!newPassword || !currentPassword) {
      return NextResponse.json(
        { error: 'New password and current password are required' },
        { status: 400 }
      )
    }
    
    // Verify current password
    if (storedPassword && currentPassword !== storedPassword) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }
    
    // Validate new password strength
    const errors: string[] = []
    if (newPassword.length < 8) errors.push('Password must be at least 8 characters long')
    if (!/[A-Z]/.test(newPassword)) errors.push('Password must contain at least one uppercase letter')
    if (!/[a-z]/.test(newPassword)) errors.push('Password must contain at least one lowercase letter')
    if (!/\d/.test(newPassword)) errors.push('Password must contain at least one number')
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) errors.push('Password must contain at least one special character')
    
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Password does not meet security requirements', details: errors },
        { status: 400 }
      )
    }
    
    // Update password
    storedPassword = newPassword
    
    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
    })
  } catch (error) {
    console.error('Error updating password:', error)
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    )
  }
}

// PUT - Initialize password (first time setup)
export async function PUT(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    // Validate input
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }
    
    // Check if password already exists
    if (storedPassword) {
      return NextResponse.json(
        { error: 'Password already exists' },
        { status: 409 }
      )
    }
    
    // Validate password strength
    const errors: string[] = []
    if (password.length < 8) errors.push('Password must be at least 8 characters long')
    if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter')
    if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter')
    if (!/\d/.test(password)) errors.push('Password must contain at least one number')
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Password must contain at least one special character')
    
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Password does not meet security requirements', details: errors },
        { status: 400 }
      )
    }
    
    // Initialize password
    storedPassword = password
    
    return NextResponse.json({
      success: true,
      message: 'Password initialized successfully',
    })
  } catch (error) {
    console.error('Error initializing password:', error)
    return NextResponse.json(
      { error: 'Failed to initialize password' },
      { status: 500 }
    )
  }
}
