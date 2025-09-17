import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !['ADMIN', 'MODERATOR'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin or Moderator access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const lines = searchParams.get('lines') || '50'

    const response = await fetch(
      `${process.env.MINECRAFT_API_URL}/api/server/logs?lines=${lines}`,
      {
        headers: {
          'x-api-key': process.env.MINECRAFT_API_KEY!,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`MC API responded with ${response.status}`)
    }

    const data = await response.json()

    // Transform raw log string into structured log objects
    if (typeof data.logs === 'string') {
      const logLines = data.logs
        .split('\n')
        .filter(line => line.trim() !== '')
        .map((line: string) => {
          // Remove ANSI escape codes
          const cleanLine = line.replace(/\x1b\[[0-9;]*m/g, '').replace(/\r/g, '')

          // Try to parse Minecraft log format: [HH:MM:SS] [Thread/LEVEL] [Mod/]: Message
          const logMatch = cleanLine.match(/\[(\d{2}:\d{2}:\d{2})\]\s*\[([^\]]+)\/([^\]]+)\]\s*(?:\[([^\]]+)\]:)?\s*(.*)/)

          if (logMatch) {
            const [, time, thread, level, mod, message] = logMatch
            return {
              timestamp: time,
              level: level.toUpperCase(),
              message: mod ? `[${mod}] ${message}` : message
            }
          }

          // Fallback for unparseable lines
          return {
            timestamp: new Date().toLocaleTimeString(),
            level: 'INFO',
            message: cleanLine
          }
        })

      return NextResponse.json({ logs: logLines })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Server logs error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch server logs' },
      { status: 500 }
    )
  }
}