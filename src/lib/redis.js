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
const redisClient = createClient({
  url: process.env.REDIS_URL
})

redisClient.on('error', err => console.error('Redis Client Error', err))

// Connect to Redis
redisClient.connect().catch(console.error)

// Export the redis client
export const redis = redisClient

// Helper functions for RSVP operations
async function saveRSVP(guestId, rsvpData) {
  try {
    if (!guestId || !rsvpData) {
      throw new Error('Missing required parameters')
    }
    await redis.set(`rsvp:${guestId}`, JSON.stringify(rsvpData))
    return true
  } catch (error) {
    console.error('Error saving RSVP:', error)
    throw error
  }
}

async function getRSVP(guestId) {
  try {
    const rsvp = await redis.get(`rsvp:${guestId}`)
    return rsvp ? JSON.parse(rsvp) : null
  } catch (error) {
    console.error('Error getting RSVP:', error)
    throw error
  }
}

async function getAllRSVPs() {
  try {
    const keys = await redis.keys('rsvp:*')
    if (!keys.length) return []

    const rsvps = await Promise.all(
      keys.map(async (key) => {
        const rsvp = await redis.get(key)
        return {
          guestId: key.replace('rsvp:', ''),
          ...JSON.parse(rsvp)
        }
      })
    )
    return rsvps
  } catch (error) {
    console.error('Error getting all RSVPs:', error)
    throw error
  }
}

// Export helper functions
export { saveRSVP, getRSVP, getAllRSVPs }
