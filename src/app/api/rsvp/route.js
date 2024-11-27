import { NextResponse } from 'next/server'
import { saveRSVP, getAllRSVPs } from '@/lib/redis'

export async function POST(request) {
  try {
    let rsvpData
    try {
      rsvpData = await request.json()
    } catch (error) {
      console.error('Error parsing request body:', error)
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!rsvpData || !rsvpData.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (typeof rsvpData.isAttending !== 'boolean') {
      return NextResponse.json(
        { error: 'Attendance status must be true or false' },
        { status: 400 }
      )
    }

    try {
      const guestId = rsvpData.name.toLowerCase().replace(/\s+/g, '-')
      await saveRSVP(guestId, rsvpData)
      
      // Fetch all RSVPs including the one just saved
      const allRSVPs = await getAllRSVPs()
      
      return NextResponse.json({
        success: true,
        message: 'RSVP saved successfully',
        data: allRSVPs // Include the updated RSVP list in the response
      })
    } catch (error) {
      console.error('Error saving RSVP:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to save RSVP' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Unexpected error in POST /api/rsvp:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const rsvps = await getAllRSVPs()
    return NextResponse.json(rsvps)
  } catch (error) {
    console.error('Error in GET /api/rsvp:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch RSVPs' },
      { status: 500 }
    )
  }
}
