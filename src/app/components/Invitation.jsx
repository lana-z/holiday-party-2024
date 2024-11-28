'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Invitation() {
  const [partyAddress, setPartyAddress] = useState('')

  useEffect(() => {
    const storedAddress = localStorage.getItem('partyAddress')
    if (storedAddress) {
      setPartyAddress(storedAddress)
    }
  }, [])

  return (
    <section className="relative flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative text-center space-y-8 max-w-[90%] w-fit mx-auto backdrop-blur-sm rounded-lg p-8 overflow-hidden"
      >
        <div 
          className="absolute"
        />
        
        <div className="relative">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-[#fdf7d7]">
            December 21st, 2024
          </h2>
          <p className="pt-2 text-xl sm:text-2xl text-[#fdf7d7]">6:00 - 10:00 PM</p>
          {partyAddress && (
            <p className="pt-2 text-xl sm:text-2xl text-[#fdf7d7]">{partyAddress}</p>
          )}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative prose prose-invert mx-auto mt-24">
          <p className="text-lg sm:text-lg leading-relaxed text-[#f1f1f1] max-w-prose">
            Dust off your favorite party outfit for this evening of pintxos-style bites, wines, craft cocktails, and warm vibes. Join us to connect and celebrate the season together&nbsp;in&nbsp;style.
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
