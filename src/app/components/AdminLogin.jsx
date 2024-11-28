'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function AdminLogin({ onLogin }) {
  const [token, setToken] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Verify token by attempting to fetch RSVPs
      const response = await fetch('/api/admin/manage-rsvps', {
        headers: {
          'x-admin-token': token
        }
      })

      if (!response.ok) {
        throw new Error('Invalid admin token')
      }

      // Store token in session storage (cleared when browser closes)
      sessionStorage.setItem('adminToken', token)
      onLogin(token)
      toast.success('Logged in successfully')
    } catch (error) {
      toast.error('Invalid admin token')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="token" className="block text-lg text-[#fdf7d7] font-playfair">
            Admin Token
          </label>
          <input
            type="password"
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-[#f1f1f1] shadow-sm 
                     focus:ring-1 focus:ring-emerald focus:border-emerald focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full text-xl text-[#fdf7d7] font-playfair font-bold text-center 
                   transition-colors duration-200 bg-burgundy/50 rounded-lg p-2
                   hover:bg-burgundy/70"
        >
          Login
        </button>
      </form>
    </div>
  )
}
