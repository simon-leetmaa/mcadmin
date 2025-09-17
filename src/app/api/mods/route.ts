import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 403 }
      )
    }

    const response = await fetch(`${process.env.MINECRAFT_API_URL}/api/mods`, {
      headers: {
        'x-api-key': process.env.MINECRAFT_API_KEY!,
      },
    })

    if (!response.ok) {
      throw new Error(`MC API responded with ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Mods API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mods data' },
      { status: 500 }
    )
  }
}