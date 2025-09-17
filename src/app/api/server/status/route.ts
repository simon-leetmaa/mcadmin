import { NextResponse } from 'next/server'
import { requireAuth, requireMCAPI, apiError } from '@/lib/api-auth'

export async function GET() {
  try {
    await requireAuth(['ADMIN', 'MODERATOR'])
    const response = await requireMCAPI('/api/server/status')
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Server status error:', error)
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
        return apiError(error.message, 403)
      }
    }
    return apiError('Failed to fetch server status', 500)
  }
}