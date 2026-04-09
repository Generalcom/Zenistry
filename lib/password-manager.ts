// Password management system for admin dashboard
// Stores password in Vercel environment variables

export interface PasswordResponse {
  success: boolean
  message?: string
}

// Get current password from Vercel environment
export async function getCurrentPassword(): Promise<string> {
  try {
    const response = await fetch('/api/admin/password', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch current password')
    }
    
    const data = await response.json()
    return data.password || ''
  } catch (error) {
    console.error('Error fetching password:', error)
    return ''
  }
}

// Update password in Vercel environment
export async function updatePassword(newPassword: string, currentPassword: string): Promise<PasswordResponse> {
  try {
    const response = await fetch('/api/admin/password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newPassword,
        currentPassword,
      }),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to update password',
      }
    }
    
    return {
      success: true,
      message: 'Password updated successfully',
    }
  } catch (error) {
    console.error('Error updating password:', error)
    return {
      success: false,
      message: 'Failed to update password',
    }
  }
}

// Initialize password if it doesn't exist
export async function initializePassword(initialPassword: string): Promise<PasswordResponse> {
  try {
    const response = await fetch('/api/admin/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: initialPassword,
      }),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to initialize password',
      }
    }
    
    return {
      success: true,
      message: 'Password initialized successfully',
    }
  } catch (error) {
    console.error('Error initializing password:', error)
    return {
      success: false,
      message: 'Failed to initialize password',
    }
  }
}

// Validate password strength
export function validatePasswordStrength(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}
