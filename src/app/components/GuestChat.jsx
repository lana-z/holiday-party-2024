'use client'

import { motion } from 'framer-motion'

export default function GuestChat({ guestResponses }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <h2 className="text-2xl text-[#fdf7d7] font-playfair font-bold text-center mb-8">Guest Chat</h2>
      <div className="overflow-x-auto">
        <div className="flex space-x-8 px-4 min-w-max justify-center">
          {guestResponses.map((response, index) => (
            <div 
              key={index}
              className="w-72 flex-none"
            >
              <div className="flex flex-col mb-2">
                <h3 className="text-lg text-[#fdf7d7] font-playfair">
                  {response.hasPlusOne && response.plusOneName 
                    ? `${response.name} & ${response.plusOneName}`
                    : response.name
                  }
                </h3>
              </div>
              {response.note && (
                <p className="text-[#f1f1f1] mt-2">"{response.note}"</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
