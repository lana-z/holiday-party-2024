'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

export default function PasswordEntry({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [guestName, setGuestName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const storedGuestName = localStorage.getItem('guestName')
    if (storedGuestName) {
      setGuestName(storedGuestName)
    }
  }, [])

  useEffect(() => {
    const verifyGuest = async () => {
      if (password.length === 4) {
        setIsLoading(true)
        try {
          const response = await fetch('/api/verify-guest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
          })
          const data = await response.json()
          
          if (data.success) {
            setGuestName(data.guestName)
          } else {
            setGuestName('')
          }
        } catch (error) {
          console.error('Error verifying guest:', error)
          setGuestName('')
        }
        setIsLoading(false)
      } else {
        setGuestName('')
      }
    }

    verifyGuest()
  }, [password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!/^\d{4}$/.test(password)) {
      toast.error('Please enter the last 4 digits of your phone number')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/verify-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      const data = await response.json()

      if (data.success) {
        localStorage.setItem('authenticated', 'true')
        localStorage.setItem('guestName', data.guestName)
        onSuccess()
        toast.success(`Welcome, ${data.guestName}!`)
      } else {
        toast.error(data.message || 'Invalid password. Please try again.')
      }
    } catch (error) {
      console.error('Error verifying guest:', error)
      toast.error('Error connecting to server. Please try again.')
    }
    setIsLoading(false)
  }

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg bg-gray-900/50 backdrop-blur-sm">
      <h2 className="text-2xl text-[#fdf7d7] font-playfair font-bold text-center mb-6">
        Password
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="password" className="block text-md text-[#f1f1f1]">
            Enter the last 4 digits of your phone number
          </label>
          <input
            type="password"
            id="password"
            inputMode="numeric"
            pattern="\d{4}"
            maxLength={4}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-[#f1f1f1] shadow-sm 
                     focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500
                     placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="••••"
          />
        </div>
        {guestName && (
          <div className="text-md text-[#fdf7d7] mb-4">
            Welcome, {guestName}!
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-medium 
                   text-[#fdf7d7] font-playfair bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-1 
                   focus:ring-emerald-500 focus:ring-offset-0 transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Checking...' : 'Enter Party'}
        </button>
      </form>
    </div>
  )
}