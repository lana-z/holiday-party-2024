'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'

const Sparkle = ({ delay, color, x, y, size, duration }) => (
  <motion.div
    className="absolute"
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ 
      opacity: [0.4, 1, 0.4],
      scale: [0.8, 1.2, 0.8],
    }}
    exit={{ 
      opacity: 0,
      scale: 0.5,
      transition: { duration: 1, ease: "easeOut" }
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay,
      times: [0, 0.5, 1]
    }}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      background: color,
      boxShadow: `0 0 ${size * 2}px ${size/2}px ${color}`,
      borderRadius: '50%',
      left: x,
      top: y,
    }}
  />
)

export default function PartyBackground() {
  const [sparkles, setSparkles] = useState([])
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const colors = useMemo(() => [
    '#fdf7d7', // Warm white
    '#fefbf1', // Soft cream
    '#f1f1f1', // Cool white
    '#B8860B', // Dark golden rod
  ], [])

  const generateSparkle = (index, total) => ({
    id: Date.now() + index,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 2,
    delay: (index / total) * 2, // Staggered delays
    duration: Math.random() * 3 + 4,
    color: colors[Math.floor(Math.random() * colors.length)]
  })

  useEffect(() => {
    const initialSparkles = Array.from({ length: 50 }, (_, i) => generateSparkle(i, 50))
    setSparkles(initialSparkles)

    const regenerateSparkles = () => {
      if (isTransitioning) return
      setIsTransitioning(true)
      
      // Generate new sparkles with staggered delays
      const newSparkles = Array.from({ length: 50 }, (_, i) => generateSparkle(i, 50))
      
      // Crossfade between old and new sparkles
      setTimeout(() => {
        setSparkles(newSparkles)
        setIsTransitioning(false)
      }, 1000) // Match exit animation duration
    }

    const interval = setInterval(regenerateSparkles, 8000)
    return () => clearInterval(interval)
  }, [isTransitioning, colors])

  return (
    <div className="fixed inset-0 -z-10 bg-gray-950" style={{ willChange: 'transform' }}>
      <div 
        className="absolute inset-0" 
        style={{ 
          background: 'linear-gradient(145deg, rgb(31, 41, 55), rgb(17, 24, 39))',
          willChange: 'transform'
        }}
      />
      
      {/* Sparkles */}
      <AnimatePresence mode="sync">
        {sparkles.map((sparkle) => (
          <Sparkle
            key={sparkle.id}
            x={sparkle.left}
            y={sparkle.top}
            size={sparkle.size}
            delay={sparkle.delay}
            duration={sparkle.duration}
            color={sparkle.color}
          />
        ))}
      </AnimatePresence>

      {/* Subtle radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05), transparent 70%)'
        }}
      />
    </div>
  )
}
