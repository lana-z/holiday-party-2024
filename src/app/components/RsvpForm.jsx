'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import GuestChat from './GuestChat'
import AddToCalendar from './AddToCalendar'

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

  useEffect(() => {
    // Check if user has already RSVP'd
    const hasRSVPd = localStorage.getItem('hasRSVPd') === 'true'
    const guestName = localStorage.getItem('guestName')
    
    if (hasRSVPd && guestName) {
      setHasAlreadyRSVPd(true)
      setName(guestName)
      fetchRSVPs() // Load guest messages immediately
    } else if (guestName) {
      setName(guestName)
    }
  }, [])

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
      timestamp: new Date().toISOString()
    }

    try {
      console.log('Submitting RSVP:', newResponse)
      
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newResponse),
      })

      // Log the raw response for debugging
      const responseText = await response.text()
      console.log('Raw response:', responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error('Failed to parse response as JSON:', responseText)
        throw new Error('Server returned invalid response')
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save your RSVP')
      }

      // Store RSVP status in localStorage
      localStorage.setItem('guestName', name)
      localStorage.setItem('hasRSVPd', 'true')
      
      toast.success('Thank you for your RSVP!')
      setHasSubmitted(true)
      setIsFormVisible(false)
      setHasAlreadyRSVPd(true)
      
      // Update guest responses with the data from the POST response
      if (data.data) {
        setGuestResponses(Object.values(data.data))
      }
      
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      toast.error(error.message || 'Failed to save your RSVP')
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
    <div className="max-w-md mx-auto px-4 sm:px-0">
      <button
        onClick={() => setIsFormVisible(!isFormVisible)}
        className={`w-full text-2xl text-[#fdf7d7] font-playfair font-bold text-center transition-colors duration-200 flex items-center justify-center gap-2 rounded-lg p-2 ${!isFormVisible ? 'bg-burgundy hover:bg-burgundy/90' : ''}`}
      >
        RSVP
      </button>

      <AnimatePresence>
        {isFormVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
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
              >
                Send RSVP
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
