'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import GuestChat from './GuestChat'

export default function RsvpForm() {
  const [name, setName] = useState('')
  const [hasPlusOne, setHasPlusOne] = useState(false)
  const [plusOneName, setPlusOneName] = useState('')
  const [dietaryRestrictions, setDietaryRestrictions] = useState('')
  const [note, setNote] = useState('')
  const [isAttending, setIsAttending] = useState(null)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [guestResponses, setGuestResponses] = useState([])

  useEffect(() => {
    const guestName = localStorage.getItem('guestName')
    if (guestName) {
      setName(guestName)
    }
    
    // Load existing responses from localStorage
    const savedResponses = localStorage.getItem('guestResponses')
    if (savedResponses) {
      setGuestResponses(JSON.parse(savedResponses))
      setHasSubmitted(true)
    }
  }, [])

  const handleSubmit = (e) => {
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
      note: note.trim(),
      timestamp: new Date().toISOString()
    }

    const updatedResponses = [...guestResponses, newResponse]
    setGuestResponses(updatedResponses)
    localStorage.setItem('guestResponses', JSON.stringify(updatedResponses))
    
    setHasSubmitted(true)
    setIsFormVisible(false)
    toast.success(isAttending ? 'Wonderful! See you at the party!' : 'We will miss you, but thanks for letting us know!')
  }

  if (hasSubmitted && !isFormVisible) {
    return <GuestChat guestResponses={guestResponses} />
  }

  return (
    <div className="max-w-md mx-auto">
      <button
        onClick={() => setIsFormVisible(!isFormVisible)}
        className={`w-full text-2xl text-[#fdf7d7] font-playfair font-bold text-center transition-colors duration-200 flex items-center justify-center gap-2 rounded-lg p-2 ${!isFormVisible ? 'bg-burgundy/50' : ''}`}
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
                className="w-full text-2xl text-[#fdf7d7] font-playfair font-bold text-center transition-colors duration-200 flex items-center justify-center gap-2 bg-burgundy/50 rounded-lg p-2"
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
