import { kv } from '@vercel/kv'

// Guest list operations
export async function getGuest(password) {
  const guest = await kv.hget('guests', password)
  return guest
}

export async function setGuest(password, name) {
  await kv.hset('guests', { [password]: name })
}

// RSVP operations
export async function saveRSVP(guestName, rsvpData) {
  await kv.hset('rsvps', { [guestName]: JSON.stringify(rsvpData) })
}

export async function getRSVP(guestName) {
  const rsvp = await kv.hget('rsvps', guestName)
  return rsvp ? JSON.parse(rsvp) : null
}

// Chat operations
export async function saveChat(message) {
  const timestamp = Date.now()
  await kv.zadd('chat_messages', { score: timestamp, member: JSON.stringify(message) })
}

export async function getRecentChats(limit = 50) {
  const messages = await kv.zrange('chat_messages', 0, limit - 1, { rev: true })
  return messages.map(msg => JSON.parse(msg))
}

// Admin operations
export async function getAllRSVPs() {
  const rsvps = await kv.hgetall('rsvps')
  return Object.entries(rsvps).map(([name, data]) => ({
    name,
    ...JSON.parse(data)
  }))
}

export async function getAllGuests() {
  return await kv.hgetall('guests')
}
