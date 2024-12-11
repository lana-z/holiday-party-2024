'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

export default function PasswordEntry({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [guestName, setGuestName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const storedGuestName = localStorage.getItem('guestName')
    if (storedGuestName) {
      setGuestName(storedGuestName)
    }
  }, [mounted])

  useEffect(() => {
    if (!mounted) return

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
            localStorage.setItem('guestName', data.guestName)
            localStorage.setItem('partyAddress', data.partyAddress)
            localStorage.setItem('guestCode', password)
            setIsAuthenticated(true)
          } else {
            setGuestName('')
            setPassword('')
            toast.error('Invalid code')
          }
        } catch (error) {
          console.error('Error verifying guest:', error)
          setGuestName('')
          setPassword('')
          toast.error('Error verifying guest code')
        } finally {
          setIsLoading(false)
        }
      }
    }

    verifyGuest()
  }, [password, mounted])

  const handleEnterParty = () => {
    localStorage.setItem('authenticated', 'true')
    onSuccess(password)
  }

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg bg-dark-bg/50 backdrop-blur-sm">
      {!isAuthenticated ? (
        <>
          <h2 className="text-2xl text-[#fdf7d7] font-playfair font-bold text-center mb-6">
            Password
          </h2>
          <div>
            <label htmlFor="password" className="block text-md text-[#f1f1f1] mb-4">
              Enter the last 4 digits of your phone number
            </label>
            <input
              id="password"
              type="password"
              inputMode="numeric"
              pattern="\\d{4}"
              maxLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="mt-1 block w-full rounded-md border-dark-border bg-dark-input text-[#f1f1f1] shadow-sm 
                       focus:ring-1 focus:ring-platinum focus:border-platinum focus:outline-none
                       placeholder-dark-placeholder disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••"
            />
          </div>
        </>
      ) : (
        <div className="text-center">
          <div className="text-md text-[#f1f1f1] mb-6">
            Welcome, {guestName}!
          </div>
          <button
            onClick={handleEnterParty}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-md font-medium 
                     text-[#fdf7d7] font-playfair bg-dark-bg/80 hover:bg-dark-bg/70 focus:outline-none 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enter Party
          </button>
        </div>
      )}
    </div>
  )
}