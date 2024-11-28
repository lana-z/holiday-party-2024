'use client'

import { motion } from 'framer-motion'

export default function GuestChat({ guestResponses, currentGuest, onUpdateRSVP }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-2xl text-[#fdf7d7] font-playfair font-bold text-center mb-2">Guest Chat</h2>
        <button
          onClick={onUpdateRSVP}
          className="text-sm text-[#fdf7d7]/70 hover:text-[#fdf7d7] transition-colors duration-200 underline underline-offset-4"
        >
          Need to change your RSVP?
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {guestResponses.map((response, index) => (
            <div 
              key={index}
              className="bg-gray-800/30 rounded-lg p-4 sm:p-6 text-center"
            >
              <div className="flex flex-col items-center mb-2">
                <h3 className="text-lg text-[#fdf7d7] font-playfair">
                  {response.hasPlusOne && response.plusOneName 
                    ? `${response.name} & ${response.plusOneName}`
                    : response.name
                  }
                </h3>
              </div>
              {response.note && (
                <p className="text-[#f1f1f1] mt-2 italic">&quot;{response.note.replace(/"/g, '&quot;')}&quot;</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
