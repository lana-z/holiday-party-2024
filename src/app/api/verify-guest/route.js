import { NextResponse } from 'next/server'

// Hardcoded guest list for testing
const GUEST_LIST = {
  "1234": "Keyla",
  "5678": "Akio",
  "9012": "Casey"
}

export async function POST(request) {
  // Add no-cache headers
  const headers = {
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Content-Type': 'application/json',
  }

  try {
    const { password } = await request.json()
    console.log('API: Received password:', password)
    console.log('API: Guest list:', GUEST_LIST)
    console.log('API: Password type:', typeof password)
    console.log('API: Available passwords:', Object.keys(GUEST_LIST))

    if (password in GUEST_LIST) {
      console.log('API: Match found! Guest name:', GUEST_LIST[password])
      return NextResponse.json({
        success: true,
        guestName: GUEST_LIST[password]
      }, { headers })
    }

    console.log('API: No match found for password')
    return NextResponse.json({
      success: false,
      message: 'Invalid password'
    }, { headers })
  } catch (error) {
    console.error('API: Server error:', error)
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500, headers })
  }
}
