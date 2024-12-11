import { NextResponse } from 'next/server'
import { saveRSVP, getAllRSVPs, getRSVP } from '@/lib/redis'

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
      if (!rsvpData.guestCode) {
        return NextResponse.json(
          { error: 'Guest code is required' },
          { status: 400 }
        )
      }

      // Use the guest code as the unique identifier
      await saveRSVP(rsvpData.guestCode, rsvpData)
      
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

export async function GET(request) {
  try {
    // Check if a specific guest code is requested
    const { searchParams } = new URL(request.url)
    const guestCode = searchParams.get('guestCode')

    if (guestCode) {
      const rsvp = await getRSVP(guestCode)
      if (!rsvp) {
        return NextResponse.json(
          { error: 'RSVP not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(rsvp)
    }

    // If no guest code provided, return all RSVPs (for admin/chat purposes)
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
