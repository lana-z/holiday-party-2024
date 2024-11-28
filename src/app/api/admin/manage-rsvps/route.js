import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN

// Verify admin token middleware
const verifyAdmin = (token) => {
  if (token !== ADMIN_TOKEN) {
    throw new Error('Unauthorized')
  }
}

export async function GET(request) {
  try {
    const token = request.headers.get('x-admin-token')
    verifyAdmin(token)

    // Get specific RSVP if guestId is provided
    const { searchParams } = new URL(request.url)
    const guestId = searchParams.get('guestId')
    
    if (guestId) {
      const data = await redis.get(`rsvp:${guestId}`)
      return NextResponse.json(data ? JSON.parse(data) : null)
    }

    // Otherwise, get all RSVPs with their IDs
    const keys = await redis.keys('rsvp:*')
    const result = {}
    
    for (const key of keys) {
      const data = await redis.get(key)
      result[key.replace('rsvp:', '')] = JSON.parse(data)
    }
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const token = request.headers.get('x-admin-token')
    verifyAdmin(token)

    const { searchParams } = new URL(request.url)
    const guestId = searchParams.get('guestId')

    // If guestId is provided, delete specific RSVP
    if (guestId) {
      await redis.del(`rsvp:${guestId}`)
      return NextResponse.json({ 
        success: true,
        message: `Deleted RSVP for ${guestId}`
      })
    }
    
    // If no guestId, delete all RSVPs
    const keys = await redis.keys('rsvp:*')
    if (keys.length > 0) {
      await redis.del(...keys)
    }

    return NextResponse.json({ 
      success: true,
      message: `Deleted all RSVPs (${keys.length} total)`
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const token = request.headers.get('x-admin-token')
    verifyAdmin(token)

    const { guestId, rsvpData } = await request.json()
    
    if (!guestId || !rsvpData) {
      return NextResponse.json(
        { error: 'guestId and rsvpData are required' },
        { status: 400 }
      )
    }

    await redis.set(`rsvp:${guestId}`, JSON.stringify(rsvpData))
    return NextResponse.json({ 
      success: true,
      message: `Updated RSVP for ${guestId}`
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}
