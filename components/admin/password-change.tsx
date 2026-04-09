'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Eye, EyeOff, Key, Shield, CheckCircle } from 'lucide-react'
import { updatePassword, validatePasswordStrength } from '@/lib/password-manager'

interface PasswordChangeProps {
  onPasswordChanged?: () => void
}

export function PasswordChange({ onPasswordChanged }: PasswordChangeProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordStrength, setShowPasswordStrength] = useState(false)

  const passwordStrength = validatePasswordStrength(newPassword)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    // Validate password strength
    const strengthCheck = validatePasswordStrength(newPassword)
    if (!strengthCheck.isValid) {
      toast.error(strengthCheck.errors[0] || 'Password does not meet requirements')
      return
    }

    setIsLoading(true)
    
    try {
      const result = await updatePassword(newPassword, currentPassword)
      
      if (result.success) {
        toast.success('Password updated successfully!')
        // Clear form
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setShowPasswordStrength(false)
        onPasswordChanged?.()
      } else {
        toast.error(result.message || 'Failed to update password')
      }
    } catch (error) {
      toast.error('An error occurred while updating password')
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    if (!newPassword) return 'text-gray-400'
    const errors = passwordStrength.errors.length
    if (errors === 0) return 'text-green-600'
    if (errors <= 2) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPasswordStrengthText = () => {
    if (!newPassword) return ''
    const errors = passwordStrength.errors.length
    if (errors === 0) return 'Strong'
    if (errors <= 2) return 'Fair'
    return 'Weak'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <div className="relative">
            <Input
              id="current-password"
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative">
            <Input
              id="new-password"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                if (e.target.value) setShowPasswordStrength(true)
              }}
              placeholder="Enter new password"
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {showPasswordStrength && newPassword && (
            <div className="mt-2">
              <div className="flex items-center gap-2 text-sm">
                <Key className={`h-3 w-3 ${getPasswordStrengthColor()}`} />
                <span className={getPasswordStrengthColor()}>
                  Password strength: {getPasswordStrengthText()}
                </span>
              </div>
              
              {/* Password Requirements */}
              <div className="mt-2 space-y-1">
                {[
                  { test: newPassword.length >= 8, text: 'At least 8 characters' },
                  { test: /[A-Z]/.test(newPassword), text: 'One uppercase letter' },
                  { test: /[a-z]/.test(newPassword), text: 'One lowercase letter' },
                  { test: /\d/.test(newPassword), text: 'One number' },
                  { test: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword), text: 'One special character' },
                ].map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    {req.test ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <div className="h-3 w-3 rounded-full border border-gray-300" />
                    )}
                    <span className={req.test ? 'text-green-600' : 'text-gray-500'}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          {/* Password Match Indicator */}
          {confirmPassword && (
            <div className="mt-1">
              {newPassword === confirmPassword ? (
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>Passwords match</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-red-600">
                  <div className="h-3 w-3 rounded-full border border-red-600" />
                  <span>Passwords do not match</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            className="w-full"
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </form>
    </div>
  )
}
