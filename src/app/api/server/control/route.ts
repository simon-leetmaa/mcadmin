import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const controlSchema = z.object({
  action: z.enum(['start', 'stop', 'restart']),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { action } = controlSchema.parse(body)

    const response = await fetch(`${process.env.MINECRAFT_API_URL}/api/server/${action}`, {
      method: 'POST',
      headers: {
        'x-api-key': process.env.MINECRAFT_API_KEY!,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`MC API responded with ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid action', errors: error.issues },
        { status: 400 }
      )
    }

    console.error('Server control error:', error)
    return NextResponse.json(
      { error: 'Failed to control server' },
      { status: 500 }
    )
  }
}