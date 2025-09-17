import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requireMCAPI, apiError } from '@/lib/api-auth'

export async function GET(req: NextRequest) {
  try {
    await requireAuth(['ADMIN', 'MODERATOR'])

    const { searchParams } = new URL(req.url)
    const lines = searchParams.get('lines') || '50'

    const response = await requireMCAPI(`/api/server/logs?lines=${lines}`)

    const data = await response.json()

    // Transform raw log string into structured log objects
    if (typeof data.logs === 'string') {
      const logLines = data.logs
        .split('\n')
        .filter((line: string) => line.trim() !== '')
        .map((line: string) => {
          // Remove ANSI escape codes
          const cleanLine = line.replace(/\x1b\[[0-9;]*m/g, '').replace(/\r/g, '')

          // Try to parse Minecraft log format: [HH:MM:SS] [Thread/LEVEL] [Mod/]: Message
          const logMatch = cleanLine.match(/\[(\d{2}:\d{2}:\d{2})\]\s*\[([^\]]+)\/([^\]]+)\]\s*(?:\[([^\]]+)\]:)?\s*(.*)/)

          if (logMatch) {
            const [, time, , level, mod, message] = logMatch
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
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
        return apiError(error.message, 403)
      }
    }
    return apiError('Failed to fetch server logs', 500)
  }
}