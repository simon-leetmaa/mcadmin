import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test connection to MC API health endpoint
    const response = await fetch(`${process.env.MINECRAFT_API_URL}/health`, {
      headers: {
        'x-api-key': process.env.MINECRAFT_API_KEY!,
      },
    })

    if (!response.ok) {
      return NextResponse.json({
        connected: false,
        error: `MC API responded with ${response.status}`,
        url: process.env.MINECRAFT_API_URL,
      })
    }

    const data = await response.json()
    return NextResponse.json({
      connected: true,
      mcApiResponse: data,
      url: process.env.MINECRAFT_API_URL,
    })
  } catch (error) {
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      url: process.env.MINECRAFT_API_URL,
    })
  }
}