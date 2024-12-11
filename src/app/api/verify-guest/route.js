import { NextResponse } from 'next/server'

// Get guest list from environment variable
const GUEST_LIST = JSON.parse(process.env.GUEST_LIST || '{}')
const PARTY_ADDRESS = process.env.PARTY_ADDRESS

export async function POST(request) {
  // Add no-cache headers
  const headers = {
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Content-Type': 'application/json',
  }

  try {
    const { password } = await request.json()

    if (password in GUEST_LIST) {
      return NextResponse.json({
        success: true,
        guestName: GUEST_LIST[password],
        partyAddress: PARTY_ADDRESS
      }, { headers })
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid password'
    }, { headers })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { headers, status: 500 })
  }
}
