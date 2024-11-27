import { createClient } from 'redis'

// Validate environment variables
const requiredEnvVars = {
  REDIS_URL: process.env.REDIS_URL,
}

Object.entries(requiredEnvVars).forEach(([name, value]) => {
  if (!value) {
    throw new Error(`${name} environment variable is required`)
  }
})

// Initialize Redis client
const redis = createClient({
  url: process.env.REDIS_URL
})

redis.on('error', err => console.error('Redis Client Error', err))

// Connect to Redis
redis.connect().catch(console.error)

// Helper functions for RSVP operations
export async function saveRSVP(guestId, rsvpData) {
  try {
    if (!guestId || !rsvpData) {
      throw new Error('Missing guestId or rsvpData')
    }

    if (!redis.isOpen) {
      await redis.connect()
    }

    const key = `rsvp:${guestId}`
    const data = JSON.stringify({
      ...rsvpData,
      timestamp: new Date().toISOString()
    })

    const result = await redis.set(key, data)
    if (!result) {
      throw new Error('Failed to save to database')
    }

    return true
  } catch (error) {
    console.error('Redis saveRSVP error:', error)
    throw new Error(error.message || 'Database operation failed')
  }
}

export async function getRSVP(guestId) {
  try {
    if (!guestId) {
      throw new Error('Missing guestId')
    }

    if (!redis.isOpen) {
      await redis.connect()
    }

    const key = `rsvp:${guestId}`
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Redis getRSVP error:', error)
    throw new Error(error.message || 'Database operation failed')
  }
}

export async function getAllRSVPs() {
  try {
    if (!redis.isOpen) {
      await redis.connect()
    }

    const keys = await redis.keys('rsvp:*')
    if (!keys || !keys.length) return {}

    const pipeline = redis.multi()
    keys.forEach(key => pipeline.get(key))
    const results = await pipeline.exec()

    const rsvps = {}
    results.forEach((result, index) => {
      try {
        const guestId = keys[index].replace('rsvp:', '')
        if (result) {
          rsvps[guestId] = JSON.parse(result)
        }
      } catch (e) {
        console.error(`Error parsing RSVP data for ${keys[index]}:`, e)
      }
    })

    return rsvps
  } catch (error) {
    console.error('Redis getAllRSVPs error:', error)
    throw new Error(error.message || 'Database operation failed')
  }
}
