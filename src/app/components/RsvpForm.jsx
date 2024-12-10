'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import GuestChat from './GuestChat'
import AddToCalendar from './AddToCalendar'
import PasswordEntry from './PasswordEntry'

export default function RsvpForm() {
  const [name, setName] = useState('')
  const [hasPlusOne, setHasPlusOne] = useState(false)
  const [plusOneName, setPlusOneName] = useState('')
  const [dietaryRestrictions, setDietaryRestrictions] = useState('')
  const [note, setNote] = useState('')
  const [isAttending, setIsAttending] = useState(null)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [hasAlreadyRSVPd, setHasAlreadyRSVPd] = useState(false)
  const [guestResponses, setGuestResponses] = useState([])
  const [isUpdating, setIsUpdating] = useState(false)
  const [guestCode, setGuestCode] = useState('')

  useEffect(() => {
    // Check if user has already RSVP'd and get their code
    const hasRSVPd = localStorage.getItem('hasRSVPd') === 'true'
    const guestName = localStorage.getItem('guestName')
    const storedGuestCode = localStorage.getItem('guestCode')
    const isAuthenticated = localStorage.getItem('authenticated') === 'true'
    
    if (storedGuestCode && isAuthenticated) {
      setGuestCode(storedGuestCode)
      if (hasRSVPd && guestName) {
        setHasAlreadyRSVPd(true)
        setName(guestName)
        fetchRSVPs()
        
        // Check if guest has an existing RSVP
        fetchExistingRSVP(storedGuestCode)
      } else if (guestName) {
        setName(guestName)
      }
    }
  }, [])

  const fetchExistingRSVP = async (code) => {
    try {
      const response = await fetch(`/api/rsvp?guestCode=${code}`)
      if (!response.ok) {
        if (response.status !== 404) {
          throw new Error('Error fetching RSVP')
        }
        return
      }
      
      const existingRSVP = await response.json()
      if (existingRSVP) {
        // Pre-fill form with existing RSVP data
        setIsAttending(existingRSVP.isAttending)
        setHasPlusOne(existingRSVP.hasPlusOne || false)
        setPlusOneName(existingRSVP.plusOneName || '')
        setDietaryRestrictions(existingRSVP.dietaryRestrictions || '')
        setNote(existingRSVP.note || '')
        setIsUpdating(true)
      }
    } catch (error) {
      console.error('Error fetching existing RSVP:', error)
    }
  }

  const fetchRSVPs = async () => {
    try {
      const res = await fetch('/api/rsvp')
      if (!res.ok) throw new Error('Failed to fetch RSVPs')
      const data = await res.json()
      setGuestResponses(Object.values(data))
    } catch (error) {
      console.error('Error fetching RSVPs:', error)
      toast.error('Failed to load RSVPs')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isAttending === null) {
      toast.error('Please indicate if you will be attending')
      return
    }

    const newResponse = {
      name,
      isAttending,
      hasPlusOne,
      plusOneName: hasPlusOne ? plusOneName : '',
      dietaryRestrictions,
      note: note.trim(),
      timestamp: new Date().toISOString(),
      guestCode
    }

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newResponse),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save RSVP')
      }

      // Store RSVP status in localStorage
      localStorage.setItem('guestName', name)
      localStorage.setItem('hasRSVPd', 'true')
      
      toast.success('Thank you for your RSVP!')
      setHasSubmitted(true)
      setIsFormVisible(false)
      setHasAlreadyRSVPd(true)
      setIsUpdating(false)
      
      // Update guest responses with the data from the POST response
      if (data.data) {
        setGuestResponses(Object.values(data.data))
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      toast.error(error.message)
    }
  }

  // Function to handle starting the update process
  const handleStartUpdate = () => {
    setIsUpdating(true)
    setHasAlreadyRSVPd(false)
    setIsFormVisible(true)
  }

  // Show GuestChat if the user has already RSVP'd or just submitted
  if ((hasAlreadyRSVPd || hasSubmitted) && !isUpdating) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AddToCalendar />
        <GuestChat 
          guestResponses={guestResponses} 
          currentGuest={name}
          onUpdateRSVP={handleStartUpdate} 
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <AnimatePresence>
        {!guestCode ? (
          <PasswordEntry onSuccess={(code) => {
            setGuestCode(code)
            fetchExistingRSVP(code)
          }} />
        ) : !isFormVisible ? (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsFormVisible(true)}
            className="w-full text-2xl text-[#fdf7d7] font-playfair font-bold text-center transition-colors duration-200 flex items-center justify-center gap-2 bg-burgundy hover:bg-burgundy/90 rounded-lg p-4"
          >
            RSVP
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="backdrop-blur-sm rounded-lg p-8"
          >
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="name" className="block text-lg text-[#fdf7d7] font-playfair">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-[#f1f1f1] shadow-sm 
                           focus:ring-1 focus:ring-emerald focus:border-emerald focus:outline-none
                           placeholder-gray-400"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="attending"
                    checked={isAttending === true}
                    onChange={() => setIsAttending(true)}
                    className="h-4 w-4 text-emerald focus:ring-emerald focus:ring-offset-0 border-gray-300
                             checked:bg-emerald hover:bg-emerald/80 accent-emerald focus:outline-none"
                  />
                  <label htmlFor="attending" className="ml-2 block text-lg text-[#fdf7d7] font-playfair">
                    Count me in 
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="notAttending"
                    checked={isAttending === false}
                    onChange={() => setIsAttending(false)}
                    className="h-4 w-4 text-emerald focus:ring-emerald focus:ring-offset-0 border-gray-300
                             checked:bg-emerald hover:bg-emerald/80 accent-emerald focus:outline-none"
                  />
                  <label htmlFor="notAttending" className="ml-2 block text-lg text-[#fdf7d7] font-playfair">
                    Unfortunately, I can&apos;t make it 
                  </label>
                </div>
              </div>

              {isAttending && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="plusOne"
                    checked={hasPlusOne}
                    onChange={(e) => setHasPlusOne(e.target.checked)}
                    className="h-4 w-4 text-emerald focus:ring-emerald focus:ring-offset-0 border-gray-300 rounded
                             checked:bg-emerald hover:bg-emerald/80 accent-emerald focus:outline-none"
                  />
                  <label htmlFor="plusOne" className="ml-2 block text-lg text-[#fdf7d7] font-playfair">
                    I&apos;m bringing a plus one
                  </label>
                </div>
              )}

              {hasPlusOne && isAttending && (
                <div>
                  <label htmlFor="plusOneName" className="block text-lg text-[#fdf7d7] font-playfair">
                    Name
                  </label>
                  <input
                    type="text"
                    id="plusOneName"
                    value={plusOneName}
                    onChange={(e) => setPlusOneName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-[#f1f1f1] shadow-sm 
                             focus:ring-1 focus:ring-emerald focus:border-emerald focus:outline-none
                             placeholder-gray-400"
                    placeholder="Your guest&apos;s name"
                  />
                </div>
              )}

              <div>
                <label htmlFor="dietaryRestrictions" className="block text-lg text-[#fdf7d7] font-playfair">
                  Dietary Restrictions
                </label>
                <textarea
                  id="dietaryRestrictions"
                  value={dietaryRestrictions}
                  onChange={(e) => setDietaryRestrictions(e.target.value)}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-[#f1f1f1] shadow-sm 
                           focus:ring-1 focus:ring-emerald focus:border-emerald focus:outline-none
                           placeholder-gray-400"
                  placeholder="Remind us!"
                />
              </div>

              <div>
                <label htmlFor="note" className="block text-lg text-[#fdf7d7] font-playfair">
                  Note
                </label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-[#f1f1f1] shadow-sm 
                           focus:ring-1 focus:ring-emerald focus:border-emerald focus:outline-none
                           placeholder-gray-400"
                  placeholder="This note will be visible to party guests"
                />
              </div>
              
              <button
                type="submit"
                className="w-full text-2xl text-[#fdf7d7] font-playfair font-bold text-center transition-colors duration-200 flex items-center justify-center gap-2 bg-burgundy hover:bg-burgundy/90 rounded-lg p-2"
                disabled={!isAttending || !name}
                onClick={handleSubmit}
              >
                {isUpdating ? "Update RSVP" : "Send RSVP"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
